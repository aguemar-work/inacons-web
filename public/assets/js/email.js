const btn = document.getElementById('button');
const form = document.getElementById('form');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const originalText = btn.value;
  btn.value = 'Enviando...';
  btn.disabled = true;

  const serviceID = 'service_pdi3tur';
  const templateID = 'template_9ap0hi2';

  emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = '¡Mensaje enviado!';
      form.reset();
    })
    .catch(() => {
      btn.value = originalText;
      btn.disabled = false;
      alert('Hubo un problema al enviar el mensaje. Por favor intenta nuevamente o escríbenos directamente a nuestro correo.');
    });
});