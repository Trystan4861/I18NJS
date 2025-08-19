/**
 * Tests de integración para I18NJS
 * Pruebas de flujos completos y casos de uso reales
 * Autor: @trystan4861
 */

import { I18n } from '../../src/I18n';
import { TranslationDataset } from '../../src/types/i18n.types';

describe('I18n Integration Tests', () => {
  let i18n: I18n;
  let realWorldTranslations: TranslationDataset;

  beforeEach(() => {
    i18n = new I18n();
    realWorldTranslations = {
      es: {
        page: {
          title: 'Mi Aplicación',
          subtitle: 'Bienvenido a nuestra plataforma'
        },
        navigation: {
          home: 'Inicio',
          about: 'Acerca de',
          contact: 'Contacto',
          login: 'Iniciar Sesión'
        },
        form: {
          labels: {
            name: 'Nombre',
            email: 'Correo Electrónico',
            message: 'Mensaje'
          },
          placeholders: {
            name: 'Ingresa tu nombre',
            email: 'tu@email.com',
            message: 'Escribe tu mensaje aquí'
          },
          buttons: {
            submit: 'Enviar',
            cancel: 'Cancelar',
            reset: 'Limpiar'
          },
          validation: {
            required: 'Este campo es obligatorio',
            email: 'Ingresa un email válido',
            minLength: 'Mínimo {min} caracteres'
          }
        },
        messages: {
          success: 'Operación exitosa',
          error: 'Ha ocurrido un error',
          loading: 'Cargando...',
          noData: 'No hay datos disponibles'
        }
      },
      en: {
        page: {
          title: 'My Application',
          subtitle: 'Welcome to our platform'
        },
        navigation: {
          home: 'Home',
          about: 'About',
          contact: 'Contact',
          login: 'Login'
        },
        form: {
          labels: {
            name: 'Name',
            email: 'Email',
            message: 'Message'
          },
          placeholders: {
            name: 'Enter your name',
            email: 'your@email.com',
            message: 'Write your message here'
          },
          buttons: {
            submit: 'Submit',
            cancel: 'Cancel',
            reset: 'Reset'
          },
          validation: {
            required: 'This field is required',
            email: 'Enter a valid email',
            minLength: 'Minimum {min} characters'
          }
        },
        messages: {
          success: 'Successful operation',
          error: 'An error occurred',
          loading: 'Loading...',
          noData: 'No data available'
        }
      },
      fr: {
        page: {
          title: 'Mon Application',
          subtitle: 'Bienvenue sur notre plateforme'
        },
        navigation: {
          home: 'Accueil',
          about: 'À Propos',
          contact: 'Contact',
          login: 'Connexion'
        },
        form: {
          labels: {
            name: 'Nom',
            email: 'Email',
            message: 'Message'
          },
          placeholders: {
            name: 'Entrez votre nom',
            email: 'votre@email.com',
            message: 'Écrivez votre message ici'
          },
          buttons: {
            submit: 'Envoyer',
            cancel: 'Annuler',
            reset: 'Réinitialiser'
          },
          validation: {
            required: 'Ce champ est obligatoire',
            email: 'Entrez un email valide',
            minLength: 'Minimum {min} caractères'
          }
        },
        messages: {
          success: 'Opération réussie',
          error: 'Une erreur est survenue',
          loading: 'Chargement...',
          noData: 'Aucune donnée disponible'
        }
      }
    };
  });

  describe('Complete Application Flow', () => {
    beforeEach(() => {
      // Simular una página web completa
      document.body.innerHTML = `
        <header>
          <h1 data-i18n-key="page.title">My Application</h1>
          <p data-i18n-key="page.subtitle">Welcome to our platform</p>
          <nav>
            <a href="#" data-i18n-key="navigation.home">Home</a>
            <a href="#" data-i18n-key="navigation.about">About</a>
            <a href="#" data-i18n-key="navigation.contact">Contact</a>
            <a href="#" data-i18n-key="navigation.login">Login</a>
          </nav>
        </header>
        
        <main>
          <form id="contactForm">
            <div class="field">
              <label data-i18n-key="form.labels.name">Name</label>
              <input type="text" data-i18n-key="form.placeholders.name" placeholder="Enter your name">
            </div>
            <div class="field">
              <label data-i18n-key="form.labels.email">Email</label>
              <input type="email" data-i18n-key="form.placeholders.email" placeholder="your@email.com">
            </div>
            <div class="field">
              <label data-i18n-key="form.labels.message">Message</label>
              <textarea data-i18n-key="form.placeholders.message" placeholder="Write your message here"></textarea>
            </div>
            <div class="buttons">
              <button type="submit" data-i18n-key="form.buttons.submit">Submit</button>
              <button type="button" data-i18n-key="form.buttons.cancel">Cancel</button>
              <button type="reset" data-i18n-key="form.buttons.reset">Reset</button>
            </div>
          </form>
          
          <div id="messages">
            <div class="success hidden" data-i18n-key="messages.success">Successful operation</div>
            <div class="error hidden" data-i18n-key="messages.error">An error occurred</div>
            <div class="loading hidden" data-i18n-key="messages.loading">Loading...</div>
          </div>
        </main>
      `;
    });

    it('should initialize and translate entire application', () => {
      // Inicializar con español
      i18n.init({ lang: 'es' });
      i18n.loadTranslations(realWorldTranslations);
      i18n.translate({ lang: 'es' });

      // Verificar header
      expect(document.querySelector('[data-i18n-key="page.title"]')?.textContent).toBe('Mi Aplicación');
      expect(document.querySelector('[data-i18n-key="page.subtitle"]')?.textContent).toBe('Bienvenido a nuestra plataforma');

      // Verificar navegación
      expect(document.querySelector('[data-i18n-key="navigation.home"]')?.textContent).toBe('Inicio');
      expect(document.querySelector('[data-i18n-key="navigation.about"]')?.textContent).toBe('Acerca de');

      // Verificar formulario
      expect(document.querySelector('[data-i18n-key="form.labels.name"]')?.textContent).toBe('Nombre');
      expect((document.querySelector('[data-i18n-key="form.placeholders.name"]') as HTMLInputElement)?.placeholder).toBe('Ingresa tu nombre');
    });

    it('should switch languages dynamically', () => {
      i18n.loadTranslations(realWorldTranslations);
      
      // Iniciar en inglés
      i18n.translate({ lang: 'en' });
      expect(document.querySelector('[data-i18n-key="page.title"]')?.textContent).toBe('My Application');
      
      // Cambiar a francés
      i18n.translate({ lang: 'fr' });
      expect(document.querySelector('[data-i18n-key="page.title"]')?.textContent).toBe('Mon Application');
      expect(document.querySelector('[data-i18n-key="navigation.home"]')?.textContent).toBe('Accueil');
      
      // Cambiar a español
      i18n.translate({ lang: 'es' });
      expect(document.querySelector('[data-i18n-key="page.title"]')?.textContent).toBe('Mi Aplicación');
      expect(document.querySelector('[data-i18n-key="navigation.home"]')?.textContent).toBe('Inicio');
    });

    it('should handle language switching with form elements', () => {
      i18n.loadTranslations(realWorldTranslations);
      
      // Traducir a español
      i18n.translate({ lang: 'es' });
      
      const nameInput = document.querySelector('[data-i18n-key="form.placeholders.name"]') as HTMLInputElement;
      const emailInput = document.querySelector('[data-i18n-key="form.placeholders.email"]') as HTMLInputElement;
      const messageTextarea = document.querySelector('[data-i18n-key="form.placeholders.message"]') as HTMLTextAreaElement;
      
      expect(nameInput.placeholder).toBe('Ingresa tu nombre');
      expect(emailInput.placeholder).toBe('tu@email.com');
      expect(messageTextarea.placeholder).toBe('Escribe tu mensaje aquí');
      
      // Cambiar a inglés
      i18n.translate({ lang: 'en' });
      
      expect(nameInput.placeholder).toBe('Enter your name');
      expect(emailInput.placeholder).toBe('your@email.com');
      expect(messageTextarea.placeholder).toBe('Write your message here');
    });

    it('should maintain data-i18n-lang attributes correctly', () => {
      i18n.loadTranslations(realWorldTranslations);
      i18n.translate({ lang: 'fr' });
      
      const elements = document.querySelectorAll('[data-i18n-key]');
      elements.forEach(element => {
        expect(element.getAttribute('data-i18n-lang')).toBe('fr');
      });
      
      // Cambiar idioma
      i18n.translate({ lang: 'es' });
      
      elements.forEach(element => {
        expect(element.getAttribute('data-i18n-lang')).toBe('es');
      });
    });
  });

  describe('Dynamic Content Management', () => {
    beforeEach(() => {
      i18n.loadTranslations(realWorldTranslations);
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('should handle dynamically added elements', () => {
      const container = document.getElementById('container')!;
      
      // Agregar elemento dinámicamente
      const newElement = document.createElement('div');
      newElement.setAttribute('data-i18n-key', 'messages.success');
      newElement.textContent = 'Original text';
      container.appendChild(newElement);
      
      // Traducir
      i18n.translate({ lang: 'es' });
      
      expect(newElement.textContent).toBe('Operación exitosa');
      expect(newElement.getAttribute('data-i18n-lang')).toBe('es');
    });

    it('should handle multiple dynamic elements with different languages', () => {
      const container = document.getElementById('container')!;
      
      // Agregar múltiples elementos
      const elements = [
        { key: 'messages.success', lang: 'es' },
        { key: 'messages.error', lang: 'en' },
        { key: 'messages.loading', lang: 'fr' }
      ];
      
      elements.forEach(({ key, lang }) => {
        const element = document.createElement('div');
        element.setAttribute('data-i18n-key', key);
        element.textContent = 'Original';
        container.appendChild(element);
        
        i18n.translate({ element, lang });
      });
      
      const divs = container.querySelectorAll('div');
      expect(divs[0].textContent).toBe('Operación exitosa');
      expect(divs[1].textContent).toBe('An error occurred');
      expect(divs[2].textContent).toBe('Chargement...');
    });

    it('should update missing lang attributes for dynamic content', () => {
      document.documentElement.lang = 'en';
      const container = document.getElementById('container')!;
      
      // Agregar elementos sin data-i18n-lang
      const element1 = document.createElement('div');
      element1.setAttribute('data-i18n-key', 'messages.success');
      container.appendChild(element1);
      
      const element2 = document.createElement('span');
      element2.setAttribute('data-i18n-key', 'messages.error');
      container.appendChild(element2);
      
      // Actualizar atributos faltantes
      i18n.updateMissingLangAttributes();
      
      expect(element1.getAttribute('data-i18n-lang')).toBe('en');
      expect(element2.getAttribute('data-i18n-lang')).toBe('en');
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large translation datasets efficiently', () => {
      // Crear dataset grande
      const largeTranslations: TranslationDataset = {};
      const languages = ['es', 'en', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'];
      
      languages.forEach(lang => {
        largeTranslations[lang] = {};
        for (let i = 0; i < 1000; i++) {
          largeTranslations[lang][`key_${i}`] = `Translation ${i} in ${lang}`;
        }
      });
      
      const startTime = performance.now();
      i18n.loadTranslations(largeTranslations);
      const loadTime = performance.now() - startTime;
      
      expect(loadTime).toBeLessThan(100); // Menos de 100ms
      expect(i18n.getLanguages()).toHaveLength(10);
    });

    it('should handle many DOM elements efficiently', () => {
      i18n.loadTranslations(realWorldTranslations);
      
      // Crear muchos elementos
      const container = document.createElement('div');
      for (let i = 0; i < 1000; i++) {
        const element = document.createElement('span');
        element.setAttribute('data-i18n-key', 'messages.success');
        element.textContent = 'Original';
        container.appendChild(element);
      }
      document.body.appendChild(container);
      
      const startTime = performance.now();
      i18n.translate({ lang: 'es' });
      const translateTime = performance.now() - startTime;
      
      expect(translateTime).toBeLessThan(200); // Menos de 200ms
      
      // Verificar que todos se tradujeron
      const elements = container.querySelectorAll('[data-i18n-key="messages.success"]');
      elements.forEach(el => {
        expect(el.textContent).toBe('Operación exitosa');
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    beforeEach(() => {
      i18n.loadTranslations(realWorldTranslations);
    });

    it('should handle malformed HTML gracefully', () => {
      document.body.innerHTML = `
        <div data-i18n-key="messages.success">
          <span>Nested content</span>
          Some text
        </div>
        <input data-i18n-key="form.placeholders.name" placeholder="test">
      `;
      
      expect(() => i18n.translate({ lang: 'es' })).not.toThrow();
      
      const div = document.querySelector('div');
      const input = document.querySelector('input') as HTMLInputElement;
      
      expect(div?.textContent?.trim()).toBe('Operación exitosa');
      expect(input.placeholder).toBe('Ingresa tu nombre');
    });

    it('should handle missing translations gracefully', () => {
      document.body.innerHTML = `
        <div data-i18n-key="nonexistent.key">Original</div>
        <div data-i18n-key="messages.success">Success</div>
      `;
      
      i18n.translate({ lang: 'es' });
      
      const nonexistentEl = document.querySelector('[data-i18n-key="nonexistent.key"]');
      const successEl = document.querySelector('[data-i18n-key="messages.success"]');
      
      expect(nonexistentEl?.textContent).toBe('nonexistent.key');
      expect(successEl?.textContent).toBe('Operación exitosa');
    });

    it('should handle language switching with partial translations', () => {
      const partialTranslations = {
        es: {
          messages: {
            success: 'Éxito'
          }
        },
        en: {
          messages: {
            success: 'Success',
            error: 'Error'
          }
        }
      };
      
      i18n.loadTranslations(partialTranslations);
      
      document.body.innerHTML = `
        <div data-i18n-key="messages.success">Original Success</div>
        <div data-i18n-key="messages.error">Original Error</div>
      `;
      
      // Traducir a español (solo tiene success)
      i18n.translate({ lang: 'es' });
      
      expect(document.querySelector('[data-i18n-key="messages.success"]')?.textContent).toBe('Éxito');
      expect(document.querySelector('[data-i18n-key="messages.error"]')?.textContent).toBe('messages.error');
      
      // Traducir a inglés (tiene ambos)
      i18n.translate({ lang: 'en' });
      
      expect(document.querySelector('[data-i18n-key="messages.success"]')?.textContent).toBe('Success');
      expect(document.querySelector('[data-i18n-key="messages.error"]')?.textContent).toBe('Error');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should work with SPA-like navigation', () => {
      i18n.loadTranslations(realWorldTranslations);
      
      // Simular navegación SPA
      const pages = [
        '<h1 data-i18n-key="page.title">Title</h1>',
        '<nav><a data-i18n-key="navigation.home">Home</a></nav>',
        '<form><button data-i18n-key="form.buttons.submit">Submit</button></form>'
      ];
      
      pages.forEach(pageHTML => {
        document.body.innerHTML = pageHTML;
        i18n.translate({ lang: 'es' });
        
        const element = document.querySelector('[data-i18n-key]');
        expect(element?.getAttribute('data-i18n-lang')).toBe('es');
      });
    });

    it('should maintain consistency across language switches', () => {
      i18n.loadTranslations(realWorldTranslations);
      
      document.body.innerHTML = `
        <div data-i18n-key="page.title">Title</div>
        <div data-i18n-key="messages.success">Success</div>
      `;
      
      const languages = ['es', 'en', 'fr', 'es', 'en'];
      const expectedTexts = [
        ['Mi Aplicación', 'Operación exitosa'],
        ['My Application', 'Successful operation'],
        ['Mon Application', 'Opération réussie'],
        ['Mi Aplicación', 'Operación exitosa'],
        ['My Application', 'Successful operation']
      ];
      
      languages.forEach((lang, index) => {
        i18n.translate({ lang });
        
        const titleEl = document.querySelector('[data-i18n-key="page.title"]');
        const successEl = document.querySelector('[data-i18n-key="messages.success"]');
        
        expect(titleEl?.textContent).toBe(expectedTexts[index][0]);
        expect(successEl?.textContent).toBe(expectedTexts[index][1]);
      });
    });
  });
});