const btn = document.getElementById('button');

document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Enviando formulario...';

   const serviceID = 'service_pdi3tur';
   const templateID = 'template_9ap0hi2';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Formulario enviado';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Formulario enviando';
      alert(JSON.stringify(err));
    });
});