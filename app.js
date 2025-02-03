document.getElementById('tokenForm').addEventListener('submit', (e) => {
    e.preventDefault(); 
    const userToken = document.getElementById('token').value;

    if (userToken) {
        localStorage.setItem('jwtToken', userToken); 
        alert('Token guardado correctamente.');
    } else {
        alert('Por favor, ingresa un token válido.'); // por si ta vacio
    }
});

function validateToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp < Date.now() / 1000) {
            alert("El token ha expirado.");
            return false;
        }
        return true;
    } catch (error) {
        alert("El token es inválido.");
        return false;
    }
}
 
// 3. Función GET con JWT
async function fetchDataWithJWT() {
    const JWT_TOKEN = localStorage.getItem('jwtToken'); // Leer el token desde localStorage

    if (!JWT_TOKEN) {
        alert('No se encontró ningún token. Por favor, ingresa un token primero.');
        return;
    }

    if (!validateToken(JWT_TOKEN)) {
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/protected', { //Cambie jsonplaceholder.typicode.com a la direccion de mi servidor NODE.js
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
        });

        if (response.status === 200) {
            const data = await response.json();
            document.getElementById('response').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        } else {
            const errorData = await response.json();
            alert(errorData.error);
        }

    } catch (error) {
        console.error("Error GET:", error);
    }
}

 
// 4. Función POST con JWT
document.getElementById('postForm').addEventListener('submit', async (e) => {
	e.preventDefault();
	const JWT_TOKEN = localStorage.getItem('jwtToken');
	if (!validateToken(JWT_TOKEN)) {
		return;
	}
 
	const postData = {
    	title: document.getElementById('data').value,
    	body: 'Contenido de prueba',
    	userId: 1
	};
 
	try {
    	const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        	method: 'POST',
        	headers: {
            	'Authorization': `Bearer ${JWT_TOKEN}`,
            	'Content-Type': 'application/json'
        	},
        	body: JSON.stringify(postData)
    	});
    	const data = await response.json();
        document.getElementById('response').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
	} catch (error) {
        console.error("Error POST:", error);
	}
});