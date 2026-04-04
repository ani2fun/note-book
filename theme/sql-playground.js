'use strict';

(function sqlPlayground() {
    const SQL_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.min.js';
    const SQL_WASM_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.wasm';
    const ACE_SQL_MODE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.39.1/mode-sql.min.js';

    const SAMPLE_SQL = `
ATTACH DATABASE ':memory:' AS Sales;

CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    country TEXT,
    score INTEGER
);

INSERT INTO customers (id, first_name, country, score) VALUES
    (1, 'Maria', 'Germany', 350),
    (2, 'John', 'USA', 900),
    (3, 'Georg', 'UK', 750),
    (4, 'Martin', 'Germany', 500),
    (5, 'Peter', 'USA', 0);

CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    order_date TEXT,
    sales INTEGER
);

INSERT INTO orders (order_id, customer_id, order_date, sales) VALUES
    (1001, 1, '2021-01-11', 35),
    (1002, 2, '2021-04-05', 15),
    (1003, 3, '2021-06-18', 20),
    (1004, 6, '2021-08-31', 10);

CREATE TABLE Sales.Customers (
    CustomerID INTEGER PRIMARY KEY,
    FirstName TEXT,
    LastName TEXT,
    Country TEXT,
    Score INTEGER
);

INSERT INTO Sales.Customers VALUES
    (1, 'Jossef', 'Goldberg', 'Germany', 350),
    (2, 'Kevin', 'Brown', 'USA', 900),
    (3, 'Mary', NULL, 'USA', 750),
    (4, 'Mark', 'Schwarz', 'Germany', 500),
    (5, 'Anna', 'Adams', 'USA', NULL);

CREATE TABLE Sales.Employees (
    EmployeeID INTEGER PRIMARY KEY,
    FirstName TEXT,
    LastName TEXT,
    Department TEXT,
    BirthDate TEXT,
    Gender TEXT,
    Salary INTEGER,
    ManagerID INTEGER
);

INSERT INTO Sales.Employees VALUES
    (1, 'Frank', 'Lee', 'Marketing', '1988-12-05', 'M', 55000, NULL),
    (2, 'Kevin', 'Brown', 'Marketing', '1972-11-25', 'M', 65000, 1),
    (3, 'Mary', NULL, 'Sales', '1986-01-05', 'F', 75000, 1),
    (4, 'Michael', 'Ray', 'Sales', '1977-02-10', 'M', 90000, 2),
    (5, 'Carol', 'Baker', 'Sales', '1982-02-11', 'F', 55000, 3);

CREATE TABLE Sales.Products (
    ProductID INTEGER PRIMARY KEY,
    Product TEXT,
    Category TEXT,
    Price INTEGER
);

INSERT INTO Sales.Products VALUES
    (101, 'Bottle', 'Accessories', 10),
    (102, 'Tire', 'Accessories', 15),
    (103, 'Socks', 'Clothing', 20),
    (104, 'Caps', 'Clothing', 25),
    (105, 'Gloves', 'Clothing', 30);

CREATE TABLE Sales.Orders (
    OrderID INTEGER PRIMARY KEY,
    ProductID INTEGER,
    CustomerID INTEGER,
    SalesPersonID INTEGER,
    OrderDate TEXT,
    ShipDate TEXT,
    OrderStatus TEXT,
    ShipAddress TEXT,
    BillAddress TEXT,
    Quantity INTEGER,
    Sales INTEGER,
    CreationTime TEXT
);

INSERT INTO Sales.Orders VALUES
    (1, 101, 2, 3, '2025-01-01', '2025-01-05', 'Delivered', '9833 Mt. Dias Blv.', '1226 Shoe St.', 1, 10, '2025-01-01T12:34:56'),
    (2, 102, 3, 3, '2025-01-05', '2025-01-10', 'Shipped', '250 Race Court', NULL, 1, 15, '2025-01-05T23:22:04'),
    (3, 101, 1, 5, '2025-01-10', '2025-01-25', 'Delivered', '8157 W. Book', '8157 W. Book', 2, 20, '2025-01-10T18:24:08'),
    (4, 105, 1, 3, '2025-01-20', '2025-01-25', 'Shipped', '5724 Victory Lane', '', 2, 60, '2025-01-20T05:50:33'),
    (5, 104, 2, 5, '2025-02-01', '2025-02-05', 'Delivered', NULL, NULL, 1, 25, '2025-02-01T14:02:41'),
    (6, 104, 3, 5, '2025-02-05', '2025-02-10', 'Delivered', '1792 Belmont Rd.', NULL, 2, 50, '2025-02-06T15:34:57'),
    (7, 102, 1, 1, '2025-02-15', '2025-02-27', 'Delivered', '136 Balboa Court', '', 2, 30, '2025-02-16T06:22:01'),
    (8, 101, 4, 3, '2025-02-18', '2025-02-27', 'Shipped', '2947 Vine Lane', '4311 Clay Rd', 3, 90, '2025-02-18T10:45:22'),
    (9, 101, 2, 3, '2025-03-10', '2025-03-15', 'Shipped', '3768 Door Way', '', 2, 20, '2025-03-10T12:59:04'),
    (10, 102, 3, 5, '2025-03-15', '2025-03-20', 'Shipped', NULL, NULL, 0, 60, '2025-03-16T23:25:15');

CREATE TABLE Sales.OrdersArchive (
    OrderID INTEGER,
    ProductID INTEGER,
    CustomerID INTEGER,
    SalesPersonID INTEGER,
    OrderDate TEXT,
    ShipDate TEXT,
    OrderStatus TEXT,
    ShipAddress TEXT,
    BillAddress TEXT,
    Quantity INTEGER,
    Sales INTEGER,
    CreationTime TEXT
);

INSERT INTO Sales.OrdersArchive VALUES
    (1, 101, 2, 3, '2024-04-01', '2024-04-05', 'Shipped', '123 Main St', '456 Billing St', 1, 10, '2024-04-01T12:34:56'),
    (2, 102, 3, 3, '2024-04-05', '2024-04-10', 'Shipped', '456 Elm St', '789 Billing St', 1, 15, '2024-04-05T23:22:04'),
    (3, 101, 1, 4, '2024-04-10', '2024-04-25', 'Shipped', '789 Maple St', '789 Maple St', 2, 20, '2024-04-10T18:24:08'),
    (4, 105, 1, 3, '2024-04-20', '2024-04-25', 'Shipped', '987 Victory Lane', '', 2, 60, '2024-04-20T05:50:33'),
    (4, 105, 1, 3, '2024-04-20', '2024-04-25', 'Delivered', '987 Victory Lane', '', 2, 60, '2024-04-20T14:50:33'),
    (5, 104, 2, 5, '2024-05-01', '2024-05-05', 'Shipped', '345 Oak St', '678 Pine St', 1, 25, '2024-05-01T14:02:41'),
    (6, 104, 3, 5, '2024-05-05', '2024-05-10', 'Delivered', '543 Belmont Rd.', NULL, 2, 50, '2024-05-06T15:34:57'),
    (6, 104, 3, 5, '2024-05-05', '2024-05-10', 'Delivered', '543 Belmont Rd.', '3768 Door Way', 2, 50, '2024-05-07T13:22:05'),
    (6, 101, 3, 5, '2024-05-05', '2024-05-10', 'Delivered', '543 Belmont Rd.', '3768 Door Way', 2, 50, '2024-05-12T20:36:55'),
    (7, 102, 3, 5, '2024-06-15', '2024-06-20', 'Shipped', '111 Main St', '222 Billing St', 0, 60, '2024-06-16T23:25:15');
`;

    let sqlJsReadyPromise = null;
    let aceModeReadyPromise = null;

    function loadScriptOnce(url) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${url}"]`);
            if (existing) {
                if (existing.dataset.loaded === 'true') {
                    resolve();
                    return;
                }
                existing.addEventListener('load', resolve, { once: true });
                existing.addEventListener('error', () => reject(new Error(`Failed to load ${url}`)), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.addEventListener('load', () => {
                script.dataset.loaded = 'true';
                resolve();
            }, { once: true });
            script.addEventListener('error', () => reject(new Error(`Failed to load ${url}`)), { once: true });
            document.head.appendChild(script);
        });
    }

    async function ensureAceSqlMode() {
        if (!window.ace) {
            return;
        }
        if (!aceModeReadyPromise) {
            aceModeReadyPromise = loadScriptOnce(ACE_SQL_MODE_URL);
        }
        await aceModeReadyPromise;
    }

    async function ensureSqlJs() {
        if (window.initSqlJs && window.__sqlJsInstance) {
            return window.__sqlJsInstance;
        }
        if (!sqlJsReadyPromise) {
            sqlJsReadyPromise = (async () => {
                await loadScriptOnce(SQL_JS_URL);
                const SQL = await window.initSqlJs({
                    locateFile: () => SQL_WASM_URL,
                });
                window.__sqlJsInstance = SQL;
                return SQL;
            })();
        }
        return sqlJsReadyPromise;
    }

    function getEditorForBlock(codeBlock) {
        if (!window.ace || !codeBlock.classList.contains('editable')) {
            return null;
        }
        return window.ace.edit(codeBlock);
    }

    function getSqlText(codeBlock) {
        const editor = getEditorForBlock(codeBlock);
        return editor ? editor.getValue() : codeBlock.textContent;
    }

    function isLargeSetupScript(text) {
        return /CREATE DATABASE|USE master|ALTER DATABASE|DROP DATABASE|^\s*GO\s*$/im.test(text);
    }

    function createFreshDatabase(SQL) {
        const db = new SQL.Database();
        db.run(SAMPLE_SQL);
        return db;
    }

    function getResultContainer(preBlock) {
        let result = preBlock.querySelector('.result');
        if (!result) {
            result = document.createElement('div');
            result.className = 'result';
            preBlock.appendChild(result);
        }
        return result;
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function renderResults(preBlock, results) {
        const result = getResultContainer(preBlock);
        result.classList.remove('result-error', 'result-no-output');

        if (!results.length) {
            result.textContent = 'Query executed successfully. No result set returned.';
            result.classList.add('result-no-output');
            return;
        }

        const html = results.map((item, index) => {
            const header = item.columns.map(column => `<th>${escapeHtml(column)}</th>`).join('');
            const rows = item.values.map(row => {
                const cells = row.map(cell => `<td>${escapeHtml(cell == null ? 'NULL' : cell)}</td>`).join('');
                return `<tr>${cells}</tr>`;
            }).join('');
            return `
                <div class="result-set">
                    ${results.length > 1 ? `<div class="result-label">Result set ${index + 1}</div>` : ''}
                    <table class="result-table">
                        <thead><tr>${header}</tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }).join('');

        result.innerHTML = html;
    }

    function renderError(preBlock, message) {
        const result = getResultContainer(preBlock);
        result.classList.add('result-error');
        result.classList.remove('result-no-output');
        result.textContent = message;
    }

    async function runSql(preBlock, button) {
        const codeBlock = preBlock.querySelector('code');
        const sql = getSqlText(codeBlock);

        button.classList.add('is-loading');
        button.disabled = true;
        renderError(preBlock, 'Loading SQL engine...');
        preBlock.querySelector('.result').classList.remove('result-error');

        try {
            const SQL = await ensureSqlJs();
            const db = createFreshDatabase(SQL);
            const results = db.exec(sql);
            renderResults(preBlock, results);
            db.close();
        } catch (error) {
            renderError(preBlock, error.message || String(error));
        } finally {
            button.classList.remove('is-loading');
            button.disabled = false;
        }
    }

    async function configureSqlEditors(codeBlocks) {
        await ensureAceSqlMode();

        codeBlocks.forEach(codeBlock => {
            codeBlock.classList.add('editable');
            const editor = window.ace ? window.ace.edit(codeBlock) : null;
            if (editor) {
                editor.setOptions({
                    highlightActiveLine: false,
                    showPrintMargin: false,
                    showLineNumbers: window.playground_line_numbers || false,
                    showGutter: window.playground_line_numbers || false,
                    maxLines: Infinity,
                    fontSize: '0.875em',
                });
                editor.$blockScrolling = Infinity;
                editor.getSession().setMode('ace/mode/sql');
                editor.originalCode = editor.getValue();
            }
        });
    }

    function addButtons(preBlock) {
        let buttons = preBlock.querySelector('.buttons');
        if (!buttons) {
            buttons = document.createElement('div');
            buttons.className = 'buttons';
            preBlock.insertBefore(buttons, preBlock.firstChild);
        }

        const runButton = document.createElement('button');
        runButton.className = 'fa fa-play play-button';
        runButton.title = 'Run this SQL query';
        runButton.setAttribute('aria-label', runButton.title);
        buttons.insertBefore(runButton, buttons.firstChild);
        runButton.addEventListener('click', () => runSql(preBlock, runButton));

        const codeBlock = preBlock.querySelector('code');
        if (window.ace) {
            const resetButton = document.createElement('button');
            resetButton.className = 'fa fa-history reset-button';
            resetButton.title = 'Undo changes';
            resetButton.setAttribute('aria-label', resetButton.title);
            buttons.insertBefore(resetButton, buttons.firstChild);

            resetButton.addEventListener('click', () => {
                const editor = getEditorForBlock(codeBlock);
                if (editor) {
                    editor.setValue(editor.originalCode);
                    editor.clearSelection();
                }
            });

            const editor = getEditorForBlock(codeBlock);
            if (editor) {
                editor.commands.addCommand({
                    name: 'run-sql',
                    bindKey: {
                        win: 'Ctrl-Enter',
                        mac: 'Ctrl-Enter',
                    },
                    exec: () => runSql(preBlock, runButton),
                });
            }
        }
    }

    const sqlCodeBlocks = Array.from(document.querySelectorAll('pre code.language-sql')).filter(codeBlock => {
        const text = codeBlock.textContent || '';
        return !isLargeSetupScript(text);
    });

    if (sqlCodeBlocks.length === 0) {
        return;
    }

    sqlCodeBlocks.forEach(codeBlock => {
        const preBlock = codeBlock.parentElement;
        preBlock.classList.add('sql-playground');
    });

    configureSqlEditors(sqlCodeBlocks)
        .then(() => {
            sqlCodeBlocks.forEach(codeBlock => {
                addButtons(codeBlock.parentElement);
            });
        })
        .catch(error => {
            console.error('Failed to configure SQL editors', error);
        });
})();
