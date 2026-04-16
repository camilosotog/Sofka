import http from 'k6/http';

export const options = {
    // load test
    scenarios: {
        load_test: {
            executor: 'constant-arrival-rate',
            rate: 20,
            timeUnit: '1s',
            duration: '30s',
            preAllocatedVUs: 30,
            maxVUs: 50
        }
    },
    thresholds: {
        http_req_failed: ['rate<0.03'],
        http_req_duration: ['p(95)<1500']
    }
}

export default function() {
    const url = 'https://tapq6jz535.execute-api.us-east-1.amazonaws.com/preproduccion/ms-authentication/v1/user/login'
    const payload = JSON.stringify({
        email: 'admin1@coxti.com',
        password: '^!QAZxsw2'
    })

    const params = {
        headers: {
            'accept': 'application/json',
            'accept-language': 'es-ES,es;q=0.9',
            'authorization-method': 'DEFAULT',
            'content-type': 'application/json',
            'oncredit-api-token': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyQWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTQzLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJ0ZW5hbnQiOiJ5YW0tcHJlIiwic2lnbmVyIjoiZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnphV2R1WlhJaU9pSnZibU55WldScGREcHRjeTFoZFhSb1pXNTBhV05oZEdsdmJpSXNJbWxoZENJNk1UYzJPVE0zTlRNd05Td2laWGh3SWpveE56WTVNemcyTVRBMWZRLnpRWUo1Wm1zbmwzdzhRaWNSeWlrRzZrbFFlUHJMMXFPeW1JclB3VTJ3V3BNck5kaVUtb1dUTGVwQ3JTaVQtOUY3QWNUNjVlNVpnYW5Gb1JaZjRLQnlnIiwib3JpZ2luIjoiaHR0cHM6Ly9vbmNyZWRpdHYzLXByZXByb2R1Y2Npb24teWFtYWhhLmNveHRpLmNvbSIsImlhdCI6MTc2OTM3NTMwNSwiZXhwIjoxNzY5Mzg2MTA1fQ.vX-TqnzddmgSedbnKE9YFHsGVqDuZV-s1bjWlmb5zcLFv48ClYZYAVOkWnO7R3Obs6yODkrPMipZJE0nVCCtjQ',
            'origin': 'https://oncreditv3-preproduccion-yamaha.coxti.com',
            'priority': 'u=1, i',
            'referer': 'https://oncreditv3-preproduccion-yamaha.coxti.com/',
            'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'tenant': 'yam-pre',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
            'x-oncredit-secure': 'true'
        },
        timeout: '10s'
    }
    http.post(url, payload, params);
}