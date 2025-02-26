## Troubleshooting and Debugging

### Why Include Troubleshooting?
- **Proactive Support**: Anticipating and resolving common issues saves time and ensures a smooth setup.

### WireGuard Issues
- **Problem**: Nodes can’t ping each other over VPN.
- **Solution**:
    - Check `wg show` for active handshakes (`latest handshake` should be recent).
    - Ensure firewall allows UDP `51820` and ICMP.
    - Verify port forwarding and endpoints in `wg0.conf`.
- **Debug Command**: Enable WireGuard logging:
  ```bash
  echo 'module wireguard +p' | sudo tee /sys/kernel/debug/dynamic_debug/control
  ```

### K3s Issues
- **Problem**: Worker node not joining the cluster.
- **Solution**:
    - Verify `K3S_TOKEN` matches the master’s token.
    - Ensure port `6443` is open and reachable (`telnet 10.0.0.1 6443`).
    - Check VPN connectivity.
- **Logs**:
    - Master: `sudo journalctl -u k3s --no-pager`
    - Worker: `sudo journalctl -u k3s-agent --no-pager`

### NGINX Issues
- **Problem**: Reverse proxy not forwarding traffic.
- **Solution**:
    - Check NGINX logs: `sudo cat /var/log/nginx/error.log`.
    - Verify `proxy_pass` IP matches the Ingress service’s external IP.
- **Test Config**: `sudo nginx -t`

### Cert-Manager Issues
- **Problem**: Certificate not issuing.
- **Solution**:
    - Confirm DNS `A` record points to `cloud-vm`’s public IP.
    - Ensure port `80` is open on `cloud-vm`.
    - Inspect certificate status: `kubectl describe certificate kuard-k8s-tls`.

