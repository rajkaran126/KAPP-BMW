async function testSignup() {
    console.log('Testing Signup...');
    try {
        const username = `testuser_${Date.now()}`;
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: 'password123',
                name: 'Test User',
                role: 'Staff'
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }

        const data = await response.json();
        console.log('✓ Signup Successful:', data);
    } catch (error) {
        console.error('✗ Signup Failed:', error.message);
    }
}

testSignup();
