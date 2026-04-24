workspace "Homelab K8S" "Hybrid home + cloud K8S homelab with WireGuard and Cloudflare DNS." {

    model {

        /**********************
         * PEOPLE
         **********************/
        homeOperator = person "Home Operator" "Runs and maintains the homelab." {
            tags "Person"
        }

        externalUser = person "External User" "Uses apps hosted on the homelab." {
            tags "Person"
        }

        /**********************
         * EXTERNAL SYSTEMS
         **********************/
        cloudflareDNS = softwareSystem "Cloudflare DNS" "DNS for kakde.eu (A: kakde.eu -> cloud-vm IP, CNAME: * -> kakde.eu)." {
            tags "External System"
        }

        acmeCA = softwareSystem "Let's Encrypt" "Issues TLS certs via ACME." {
            tags "External System"
        }

        gitRepository = softwareSystem "Git Repository" "Stores app and infra manifests (GitOps)." {
            tags "External System"
        }

        homeRouter = softwareSystem "Home Router" "ISP router doing NAT and port forwarding." {
            tags "External Infrastructure"
        }

        /**********************
         * CORE PLATFORM
         **********************/
        hybridCluster = softwareSystem "Homelab K8S Platform" "Hybrid K8S cluster (home + AWS EC2) connected over WireGuard." {
            tags "Internal System"

            k8sControlPlane = container "K8S Control Plane" "API server and cluster state." "K8S" {
                tags "Container", "Control Plane"
            }

            k8sWorkerOnPrem = container "K8S Worker (Home)" "Runs workloads on the home LAN." "K8S node" {
                tags "Container", "Worker Node"
            }

            k8sWorkerCloud = container "K8S Worker (Cloud)" "EC2 worker running workloads and the public edge proxy." "K8S node" {
                tags "Container", "Worker Node", "Cloud"
            }

            wireguardMesh = container "WireGuard Mesh" "VPN mesh between home and cloud nodes." "WireGuard" {
                tags "Container", "Network"
            }

            calicoCni = container "Calico CNI" "Pod networking and network policies." "Calico" {
                tags "Container", "Network"
            }

            metallb = container "MetalLB" "Bare-metal LoadBalancer implementation." "MetalLB" {
                tags "Container", "Network"
            }

            nginxEdge = container "NGINX Edge Proxy" "Public reverse proxy on cloud-vm; entry point for kakde.eu." "NGINX" {
                tags "Container", "Reverse Proxy"
            }

            nginxIngress = container "NGINX Ingress" "Ingress controller routing HTTP(S) to services." "NGINX Ingress" {
                tags "Container", "Ingress"
            }

            certManager = container "cert-manager" "Handles TLS via DNS-01 on Cloudflare." "cert-manager" {
                tags "Container", "Security"
            }

            argoCD = container "Argo CD" "GitOps controller + UI for managing K8S state." "Argo CD" {
                tags "Container", "GitOps"
            }

            deployedApps = container "Workload Apps" "User workloads exposed via Ingress on *.kakde.eu." "Containers on K8S" {
                tags "Container", "Application"
            }
        }

        /**********************
         * SYSTEM RELATIONSHIPS
         **********************/
        homeOperator -> hybridCluster "Manages cluster and workloads." "kubectl / Argo CD over VPN"
        homeOperator -> cloudflareDNS "Manages DNS zone kakde.eu." "HTTPS"
        homeOperator -> gitRepository "Pushes app and infra changes." "Git"

        externalUser -> cloudflareDNS "Resolves kakde.eu and subdomains." "DNS"
        cloudflareDNS -> externalUser "Returns cloud-vm IP." "DNS"

        externalUser -> nginxEdge "Uses hosted apps." "HTTPS"
        homeRouter -> hybridCluster "Forwards VPN and optional HTTP(S) from Internet." "UDP 51820+, TCP 80/443"

        hybridCluster -> cloudflareDNS "Uses DNS-01 for certs; depends on A/CNAME records." "HTTPS API / DNS"
        hybridCluster -> acmeCA "Requests / renews certs." "ACME / HTTPS"
        hybridCluster -> gitRepository "Pulls desired state (GitOps)." "Git / HTTPS"

        /**********************
         * CONTAINER RELATIONSHIPS
         **********************/
        // Operators
        homeOperator -> k8sControlPlane "Administers cluster." "kubectl"
        homeOperator -> argoCD "Manages apps via GitOps UI/CLI." "HTTPS"

        // Traffic path
        nginxEdge -> nginxIngress "Proxies HTTP(S) into cluster over VPN." "HTTPS"
        nginxIngress -> deployedApps "Routes to services/pods." "HTTP(S)"
        nginxIngress -> metallb "Uses LoadBalancer IPs (home)." "K8S Service API"

        // Control plane / workers
        k8sControlPlane -> k8sWorkerOnPrem "Schedules pods." "K8S API"
        k8sControlPlane -> k8sWorkerCloud "Schedules pods." "K8S API"

        k8sWorkerOnPrem -> deployedApps "Runs pods (home)." "Container runtime"
        k8sWorkerCloud -> deployedApps "Runs pods (cloud)." "Container runtime"

        // Networking
        k8sControlPlane -> wireguardMesh "Uses VPN for node traffic." "WireGuard"
        k8sWorkerOnPrem -> wireguardMesh "Joins VPN mesh." "WireGuard"
        k8sWorkerCloud -> wireguardMesh "Joins VPN mesh." "WireGuard"
        nginxEdge -> wireguardMesh "Reaches in-cluster ingress endpoints." "WireGuard"

        k8sControlPlane -> calicoCni "Configures pod networking/policies." "CRDs"
        k8sWorkerOnPrem -> calicoCni "Executes CNI." "CNI"
        k8sWorkerCloud -> calicoCni "Executes CNI." "CNI"
        deployedApps -> calicoCni "Use pod network." "Pod traffic"

        k8sControlPlane -> metallb "Provides MetalLB config and services." "CRDs"
        metallb -> k8sWorkerOnPrem "Announces service IPs (home)." "L2/L3"
        metallb -> k8sWorkerCloud "May announce service IPs (cloud)." "L2/L3"

        // GitOps & certs
        argoCD -> gitRepository "Fetches desired state." "Git / HTTPS"
        argoCD -> k8sControlPlane "Applies manifests." "K8S API"

        certManager -> acmeCA "Performs ACME challenges." "HTTPS"
        certManager -> cloudflareDNS "Creates TXT records for DNS-01." "HTTPS API"
        certManager -> nginxIngress "Provides TLS secrets for ingresses." "K8S Secrets"
        deployedApps -> certManager "Use certs via secrets/ingress." "K8S Secrets"

        // DNS to edge
        cloudflareDNS -> nginxEdge "Points kakde.eu and *.kakde.eu to cloud-vm IP." "DNS"

        /**********************
         * DEPLOYMENT MODEL
         **********************/
        deploymentEnvironment homelab {
            deploymentNode homeLan "Home Network" "On-prem LAN." "LAN" {
                tags "Infrastructure Node"

                deploymentNode master01 "master-01.kakde.eu" "Home K8S control-plane node." "Linux" {
                    tags "Infrastructure Node", "On-Prem"

                    containerInstance k8sControlPlane
                    containerInstance wireguardMesh
                    containerInstance calicoCni
                    containerInstance metallb
                    containerInstance nginxIngress
                    containerInstance certManager
                    containerInstance argoCD
                }

                deploymentNode worker01 "worker-01.kakde.eu" "Home K8S worker node." "Linux" {
                    tags "Infrastructure Node", "On-Prem"

                    containerInstance k8sWorkerOnPrem
                    containerInstance wireguardMesh
                    containerInstance calicoCni
                    containerInstance metallb
                    containerInstance deployedApps
                }

                infrastructureNode homeRouterNode "Home Router" "ISP router doing NAT and port forwarding." "Router" {
                    tags "Infrastructure Node"
                }
            }

            deploymentNode awsCloud "AWS Cloud" "AWS environment hosting the cloud worker." "AWS" {
                tags "Infrastructure Node", "Cloud"

                deploymentNode cloudVm "cloud-vm.kakde.eu" "EC2 worker + public edge proxy; target of Cloudflare A record." "Linux on EC2" {
                    tags "Infrastructure Node", "Cloud"

                    containerInstance k8sWorkerCloud
                    containerInstance nginxEdge
                    containerInstance wireguardMesh
                    containerInstance calicoCni
                    containerInstance deployedApps
                }
            }
        }
    }

    views {

        /**********************
         * SYSTEM CONTEXT
         **********************/
        systemContext hybridCluster "Homelab_K8S_System_Context" "Context of the hybrid K8S homelab." {
            include *
            autoLayout lr
        }

        /**********************
         * CONTAINER VIEW
         **********************/
        container hybridCluster "Homelab_K8S_Containers" "Containers inside the K8S platform and key externals." {
            include *
            autoLayout lr
        }

        /**********************
         * DEPLOYMENT VIEW
         **********************/
        deployment hybridCluster homelab "Homelab_K8S_Deployment" "Physical deployment of nodes and main containers." {
            include *
            autoLayout lr
        }

        /**********************
         * STYLES
         **********************/
        styles {
            element "Person" {
                shape Person
                background "#08427b"
                color "#ffffff"
            }

            element "Internal System" {
                background "#1168bd"
                color "#ffffff"
                shape RoundedBox
            }

            element "External System" {
                background "#999999"
                color "#ffffff"
                shape RoundedBox
            }

            element "External Infrastructure" {
                background "#777777"
                color "#ffffff"
                shape Hexagon
            }

            element "Container" {
                background "#438dd5"
                color "#ffffff"
                shape RoundedBox
            }

            element "Control Plane" {
                background "#0b4884"
            }

            element "Worker Node" {
                background "#2d6ec2"
            }

            element "Network" {
                shape Pipe
            }

            element "Ingress" {
                shape WebBrowser
            }

            element "Reverse Proxy" {
                shape WebBrowser
            }

            element "GitOps" {
                shape Folder
            }

            element "Security" {
                shape Hexagon
            }

            element "Application" {
                background "#61a0d4"
            }

            element "Infrastructure Node" {
                background "#cccccc"
                shape Box
            }

            element "Cloud" {
                shape Ellipse
            }

            // Default relationship style
            relationship "default" {
                thickness 2
            }

            // Tagged relationship style example
            relationship "Ortho" {
                routing Orthogonal
            }
        }
    }
}
