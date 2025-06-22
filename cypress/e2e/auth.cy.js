describe('Autenticación en IKIGAI', () => {
    // Usuario de prueba
    const testUser = {
        name: 'Usuario de Prueba',
        documentId: '123456789',
        phone: '3001234567',
        email: 'testuser@ikigai.com',
        password: 'Test1234',
        gender: 'masculino',
        birthdate: '1990-01-01'
    };

    beforeEach(() => {
        // Limpiar localStorage antes de cada prueba
        cy.clearLocalStorage();
        cy.visit('/');
    });

    it('Debe mostrar el formulario de login', () => {
        cy.get('#login-form').should('be.visible');
        cy.get('#login-email').should('exist');
        cy.get('#login-password').should('exist');
    });

    it('Debe permitir el registro de un nuevo usuario', () => {
        // Interceptar la llamada al API para simular respuesta
        cy.intercept('POST', '/api/auth/register', {
            statusCode: 201,
            body: {
                success: true,
                message: 'Usuario registrado con éxito'
            }
        }).as('registerRequest');

        // Cambiar a pestaña de registro
        cy.get('.tab').contains('Registrarse').click();

        // Llenar formulario
        cy.get('#register-name').type(testUser.name);
        cy.get('#register-document').type(testUser.documentId);
        cy.get('#register-phone').type(testUser.phone);
        cy.get('#register-email').type(testUser.email);
        cy.get('#register-password').type(testUser.password);
        cy.get('#register-confirm-password').type(testUser.password);
        cy.get('#register-gender').select(testUser.gender);
        cy.get('#register-birthdate').type(testUser.birthdate);

        // Enviar formulario
        cy.get('.button').contains('Crear Cuenta').click();


        cy.wait('@registerRequest');

        // Verificar que cambió a la pestaña de login
        cy.get('#login-email').should('have.value', testUser.email);
        cy.get('#register-message', { timeout: 3000 }).should('contain', 'Registro exitoso');
    });

    it('Debe permitir el login de un usuario existente', () => {
        // Interceptar la llamada al API para simular login exitoso
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 200,
            body: {
                token: 'fake-jwt-token',
                name: testUser.name,
                username: testUser.email
            }
        }).as('loginRequest');

        // Llenar formulario de login
        cy.get('#login-email').type(testUser.email);
        cy.get('#login-password').type(testUser.password);
        cy.get('.button').contains('Ingresar').click();
    });
});