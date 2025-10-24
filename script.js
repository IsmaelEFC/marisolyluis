
        // ==========================================
        // CONFIGURACIÓN - PEGA AQUÍ TU URL DE GOOGLE SCRIPT
        // ==========================================
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx7kEzJmR9bSC3tTuYeMLUh7H4sZEDWQTC-1r6Ue3r4k7wQv9GQnD8z/exec';

        // ==========================================
        // FUNCIONES PRINCIPALES
        // ==========================================

        // Scroll event listener for other functionality
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset;
            lastScrollY = currentScrollY;
        });

        // Cargar la página
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');

            // Funcionalidad para copiar datos bancarios
            const copyButton = document.getElementById('copyBankData');
            const notification = document.getElementById('copyNotification');

            if (copyButton) {
                copyButton.addEventListener('click', () => {
                    // Obtener todos los valores de los datos bancarios
                    const bankValues = Array.from(document.querySelectorAll('.bank-value[data-copy]'));
                    const formattedText = bankValues.map(el => {
                        const label = el.closest('.bank-info').querySelector('.bank-label').textContent;
                        return `${label}: ${el.getAttribute('data-copy')}`;
                    }).join('\n');

                    // Copiar al portapapeles
                    navigator.clipboard.writeText(formattedText).then(() => {
                        // Mostrar notificación
                        notification.style.display = 'block';
                        void notification.offsetWidth; // Trigger reflow
                        notification.classList.add('show');

                        // Ocultar notificación después de 2 segundos
                        setTimeout(() => {
                            notification.classList.remove('show');
                            // Esperar a que termine la animación para ocultar
                            setTimeout(() => {
                                notification.style.display = 'none';
                            }, 300);
                        }, 2000);
                    }).catch(err => {
                        console.error('Error al copiar: ', err);
                    });
                });
            }
        });

        // Music Control
        const musicControl = document.getElementById('musicControl');
        const bgMusic = document.getElementById('bgMusic');

        musicControl.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicControl.classList.add('playing');
                musicControl.querySelector('.music-icon').textContent = '🎶';
            } else {
                bgMusic.pause();
                musicControl.classList.remove('playing');
                musicControl.querySelector('.music-icon').textContent = '🎵';
            }
        });

        // Auto-play music
        let autoPlayAttempted = false;
        document.addEventListener('click', () => {
            if (!autoPlayAttempted && bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicControl.classList.add('playing');
                    musicControl.querySelector('.music-icon').textContent = '🎶';
                }).catch((error) => { console.log("La reproducción automática fue bloqueada por el navegador.", error); });
                autoPlayAttempted = true;
            }
        }, { once: true });

        // Share Button
        document.getElementById('shareButton')?.addEventListener('click', (e) => {
            e.preventDefault();
            const url = window.location.href;
            const mensaje = `💍 ¡Estás invitado a nuestra boda! ✨\n\n👰🏻 Marisol & Luis 🤵🏻\n📅 15 de Febrero 2026\n\n¡No te lo pierdas! Confirma tu asistencia aquí:\n${url}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
        });

        // Countdown Timer
        // Formato: Año, Mes (0-11), Día, Hora, Minuto, Segundo
        const weddingDate = new Date(2026, 1, 15, 16, 0, 0).getTime();
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                document.getElementById('days').textContent = '0';
                document.getElementById('hours').textContent = '0';
                document.getElementById('minutes').textContent = '0';
                document.getElementById('seconds').textContent = '0';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minutesEl) minutesEl.textContent = minutes;
            if (secondsEl) secondsEl.textContent = seconds;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);

        // Intersection Observer for Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });

        // Parallax Effect
        function applyParallax(elementId, speed) {
            const element = document.getElementById(elementId);
            if (element) {
                const scrolled = window.pageYOffset;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            }
        }

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroBg = document.querySelector('.hero-bg.parallax');
            if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;

            applyParallax('parallax1', 0.5);
            applyParallax('parallax2', 0.3);
            applyParallax('parallax3', 0.4);
            applyParallax('parallax4', 0.2);
            applyParallax('parallax5', 0.35);
            applyParallax('parallax6', 0.45);
        });

        // Form Submission con Google Sheets
        const form = document.forms['rsvpForm'];
        const responseMessage = document.createElement('div');
        responseMessage.id = 'responseMessage';
        responseMessage.style.marginTop = '1rem';
        responseMessage.style.textAlign = 'center';
        responseMessage.style.fontWeight = '500';
        form.appendChild(responseMessage);
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const guests = document.getElementById('guests').value;
            const message = document.getElementById('message').value.trim();

            // Validaciones
            if (!name || !phone || !guests) {
                responseMessage.textContent = 'Por favor completa todos los campos requeridos';
                responseMessage.style.color = '#d4af37';
                return;
            }

            if (phone.length !== 9 || !/^\d+$/.test(phone)) {
                responseMessage.textContent = 'Por favor ingresa un número de teléfono válido (9 dígitos)';
                responseMessage.style.color = '#d4af37';
                return;
            }

            const fullPhone = '+56' + phone;

            // Deshabilitar botón
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'ENVIANDO...';
            responseMessage.textContent = '';

            // Enviar a Google Sheets
            const formData = new FormData(form);
            formData.set('phone', fullPhone); // Aseguramos que el teléfono tenga el código de país

            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    // Si la respuesta del servidor no es exitosa (ej. error 500)
                    throw new Error(`Error del servidor: ${response.statusText}`);
                }

                const text = await response.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = { success: false };
                }

                if (data.success) {
                    // Mostrar mensaje de éxito
                    responseMessage.textContent = '¡Confirmación enviada con éxito!';
                    responseMessage.style.color = '#4caf50';
                    
                    // Mostrar modal de éxito
                    const modal = document.getElementById('successModal');
                    const modalMessage = document.getElementById('modalMessage');
                    modalMessage.textContent = `¡Gracias ${name}! Tu confirmación para ${guests} ${guests === '1' ? 'persona' : 'personas'} ha sido recibida exitosamente.`;
                    modal.classList.add('show');
                    
                    // Limpiar formulario
                    form.reset();
                } else {
                    responseMessage.textContent = 'Hubo un problema al enviar tu confirmación. Por favor, intenta nuevamente o contacta directamente por WhatsApp.';
                    responseMessage.style.color = '#f44336';
                }
            } catch (error) {
                console.error('Error!', error);
                responseMessage.textContent = 'Error al enviar la confirmación. Intenta nuevamente o contáctanos por WhatsApp.';
                responseMessage.style.color = '#f44336';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                
                // Desaparecer el mensaje después de 5 segundos
                if (responseMessage.textContent) {
                    setTimeout(() => {
                        responseMessage.style.transition = 'opacity 1s';
                        responseMessage.style.opacity = '0';
                        setTimeout(() => {
                            responseMessage.textContent = '';
                            responseMessage.style.opacity = '1';
                            responseMessage.style.transition = 'none';
                        }, 1000);
                    }, 5000);
                }
            }

                // Código del manejador del formulario
            });

        // Modal functions
        function closeModal() {
            const modal = document.getElementById('successModal');
            modal.classList.remove('show');
        }

        // Cerrar modal al hacer clic fuera
        document.getElementById('successModal').addEventListener('click', (e) => {
            if (e.target.id === 'successModal') {
                closeModal();
            }
        });

        // Prevenir entrada de letras en el campo de teléfono
        document.getElementById('phone').addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 9) {
                this.value = this.value.slice(0, 9);
            }
        });

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });