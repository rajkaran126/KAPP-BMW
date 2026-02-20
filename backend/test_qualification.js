async function testQualificationUpdate() {
    const API_URL = 'http://localhost:5000/api/employees';
    console.log('Testing Qualification Update...');

    try {
        // 1. Create a test employee
        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Name: 'Test Qual Employee',
                Address: '123 Test St',
                qualifications: ['Initial Qual']
            })
        });

        if (!createRes.ok) throw new Error(`Create failed: ${await createRes.text()}`);
        const employee = await createRes.json();
        console.log('✓ Created Employee:', employee.EmpID);

        // 2. Update the employee with NEW qualifications
        const updateRes = await fetch(`${API_URL}/${employee.EmpID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Name: 'Test Qual Employee Updated',
                Address: '123 Test St',
                qualifications: ['Updated Qual 1', 'Updated Qual 2']
            })
        });

        if (!updateRes.ok) throw new Error(`Update failed: ${await updateRes.text()}`);
        const updatedEmployee = await updateRes.json();

        // 3. Verify qualifications
        const quals = updatedEmployee.qualifications.map(q => q.qualification);
        console.log('✓ Updated Qualifications:', quals);

        if (quals.includes('Updated Qual 1') && quals.includes('Updated Qual 2') && !quals.includes('Initial Qual')) {
            console.log('✓ SUCCESS: Qualifications updated correctly!');
        } else {
            console.error('✗ FAILURE: Qualifications mismatch!');
        }

    } catch (error) {
        console.error('✗ Test Failed:', error.message);
    }
}

testQualificationUpdate();
