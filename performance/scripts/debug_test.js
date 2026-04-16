import http from 'k6/http';

// Test simple para debuggear el error
export const options = {
    vus: 1,
    duration: '5s',
    thresholds: {
        // Sin thresholds para solo debuggear
    }
}

export default function() {
    console.log('🔍 Iniciando test de debug...');
    
    const url = 'https://tapq6jz535.execute-api.us-east-1.amazonaws.com/preproduccion/ms-authentication/v1/user/login'
    const payload = JSON.stringify({
        email: 'admin1@coxti.com',
        password: '^!QAZxsw2'
    })

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    http.post(url, payload, params);
}