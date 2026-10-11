# Beginner JMeter test

Open `employee-performance.jmx` in JMeter. A `.jmx` file is a saved JMeter test plan. No additional JMeter plugins are needed.

## First run

1. Start the backend on port **8080**. For a local performance run, use the command in the [API README](README.md#performance-testing-with-jmeter). If it is already running with Docker, use that API.
2. Run `jmeter` in a terminal to open JMeter.
3. Choose **File → Open** and select `employee-performance.jmx` from this folder.
4. Select the users Thread Group in the left tree. Its label still says **Users - 5 users, 3 rounds**, but the fields control the run. The saved settings are:
   - **Number of Threads (users): 20** means twenty simulated users.
   - **Ramp-up period (seconds): 5** starts those users over five seconds.
   - **Loop Count: 20** makes each user repeat the six requests twenty times.
   For a smaller first test, change users to **5** and loops to **3** before starting.
5. Click the green **Start** button.
6. Click **Summary Report** to see the performance of each endpoint. Click **View Results Tree** to inspect individual requests, response bodies, and failures.

The default target is `http://127.0.0.1:8080`. If needed, select the top-level test plan and change its `host`, `port`, or `protocol` variables. For a different port, replace `${__P(port,8080)}` with a number such as `9090`.

## What gets tested

Each user runs these requests in order:

| Step | Request | Expected status |
| --- | --- | --- |
| 1 | `GET /` — health check | 200 |
| 2 | `POST /api/v1/employees` — create a test employee | 201 |
| 3 | `GET /api/v1/employees` — list employees | 200 |
| 4 | `GET /api/v1/employees/{employeeId}` — read that employee | 200 |
| 5 | `PUT /api/v1/employees/{employeeId}` — update that employee | 200 |
| 6 | `DELETE /api/v1/employees/{employeeId}` — delete that employee | 204 |

The **Save created employee ID** component automatically reads the ID from the POST response. Each user uses its own ID. The plan changes and deletes only employees it creates. If a request fails, that user stops; an interrupted or failed run can leave test employees behind. API documentation pages such as `/docs` are outside this CRUD test.

With the current saved settings, a successful run produces **2,400 requests**: 20 users × 20 loops × 6 endpoints. Each endpoint has 400 samples. With 5 users and 3 loops, it produces 90 requests (15 per endpoint). The plan checks HTTP status codes; it does not impose a response-time pass/fail threshold.

## Combined CSV report (automatic)

Every run creates **one CSV containing all endpoints** in `jmeter-results/`, next to the saved `.jmx` file. Example: `jmeter-results/employee-results-20261010-183000-123-a1b2c3d4.csv`. A new filename is used each run, so earlier reports are kept.

Open the CSV in Excel. Each request adds a row with its UTC timestamp, endpoint name, HTTP method, URL, response time in milliseconds, status code, success, user name, and error message. Request rows have `row_type=REQUEST`. At the end, the same CSV gets one `ENDPOINT_TOTAL` row per tested endpoint and one `RUN_TOTAL` row. With the current 20 users and 20 loops, that means 2,400 request rows + 6 endpoint totals + 1 run total, plus the header. With 5 users and 3 loops, there are 90 request rows plus those same 7 totals rows. Changing users or loops changes the request count.

Three Groovy components handle this automatically:

- **Prepare combined CSV:** creates the file and header once before the users start.
- **Write all endpoints to one CSV (Groovy):** a JSR223 Listener under the users group appends a row after each request and its status assertion. Writes are synchronized so simultaneous users do not mix rows.
- **Append endpoint and complete run totals:** a tearDown Thread Group writes the final totals after all users finish.

All populated duration values include **` ms`** (for example, `125 ms`), in request rows and summary rows. Counts and HTTP status codes stay numeric. In Excel, duration cells are now text; remove the suffix if you want to use them in formulas.

Read the totals columns as follows:

- **`samples`:** number of requests executed, including failures.
- **`total_response_time_ms`:** sum of all request response times for that endpoint; the `RUN_TOTAL` row sums all endpoints.
- **`elapsed_time_ms`:** for each endpoint, the time from its first request starting to its last request ending, including gaps between calls. For `RUN_TOTAL`, the elapsed time from CSV setup completion until the users finish, including ramp-up and CSV writing but excluding setup and final summary writing.

For example, two concurrent requests taking 100 ms each have a summed response time of 200 ms but may finish in about 100 ms of elapsed time. Summary `success` is true only when all included requests succeeded. Totals reflect completed requests; forcibly stopping JMeter can prevent the final rows from being written.

Save the plan before running it. Keep these components enabled when running the full test. Writing a row after every request adds some client-side overhead, so this is best suited to your small learning runs. This CSV is separate from the optional `.jtl` and HTML report below.

## Reading Summary Report

- **Samples:** how many times an endpoint was called.
- **Average / Min / Max:** response times in milliseconds; lower is faster.
- **Error %:** failed requests; aim for **0%**.
- **Throughput:** completed requests per unit of time (check the displayed unit).

To learn gradually, start with **5 users**, **5 seconds** ramp-up, and **3 loops**. For a second experiment, change users to **10**, ramp-up to **10**, and loops to **10**. Compare response times and errors. Requests run immediately one after another, with no simulated user pauses.

For larger performance runs, disable **View Results Tree** and run from the terminal to reduce JMeter's own overhead. From the `employee-api-crud` folder:

```bash
jmeter -n -t employee-performance.jmx -l employee-results.jtl -e -o employee-report
```

Open `employee-report/index.html` for the generated report. Use a new results filename and report folder for each run. The backend stores employees in memory, so run it with one worker; multiple workers would have separate employee stores.

Reference: [Apache JMeter component documentation](https://jmeter.apache.org/usermanual/component_reference.html).
