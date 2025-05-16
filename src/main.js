import './js/nav.js'
import './normalize.css'
import './style.css'

const apiUrl = import.meta.env.VITE_API_URL;

// ANIMATION LIEN ACTIF
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav_item');

const handleScrollNav = () => {
    let currentSectionId = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if(pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });

        navItems.forEach(item => {
            const link = item.querySelector('a');
            const href = link.getAttribute('href').replace('#', '');

            if(href === currentSectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };
    
    window.addEventListener('scroll', handleScrollNav);
    handleScrollNav();    
      
//  ANIMATION MES COMPETENCES RISEUP
const ratio = 0.1;
 const options = {
    root: null,
    rootMargin: '0px',
    threshold: ratio 
};

const handleIntersect = function(entries, observer) {
    entries.forEach(function(entry) {
        if(entry.intersectionRatio > ratio) {
            entry.target.classList.add('appear-visible');
            observer.unobserve(entry.target);
        }
    });
};
// je ne rajoute la classe appear-loaded que si le javascript est chargé
document.documentElement.classList.add('appear-loaded');
const observer  =new IntersectionObserver(handleIntersect, options);
document.querySelectorAll('[class*="appear-"]').forEach(function(a) {
    observer.observe(a);
});

//  CONTACT FORM VALIDATION

const form = document.querySelector("form");

if(form) {
const nameInput = document.getElementById("nom");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submit_button");
const errorText = document.querySelectorAll(".error-msg");
  
const inputsValidity = {
    name: false,
    email: false,
    message:false
};

const showError = ({index, validation}) => {
    if(validation) {
        errorText[index].style.display = "none";
    } else {
        errorText[index].style.display = "block";
    } 
};

const nameCheck = () => {
    const regexNom = /^[A-Za-zÀ-ÿ\s'-]{3,}$/;
    if(regexNom.test(nameInput.value.trim())) {
        showError({index: 0, validation: true});
        inputsValidity.name = true;
    } else {
        showError({index: 0, validation: false});
        inputsValidity.name = false;
    }
};

const emailCheck = () => {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(regexEmail.test(emailInput.value.trim())) {
        showError({index: 1, validation: true});
        inputsValidity.email = true;
    } else {
        showError({index: 1, validation: false});
        inputsValidity.email = false;
    }
};

const messageCheck = () => {
    if(messageInput.value.trim().length >=3) {
        showError({index: 2, validation: true});
        inputsValidity.message = true;
    } else {
        showError({index: 2, validation: false});
        inputsValidity.message = false;
    }
};

nameInput.addEventListener("blur", nameCheck);
nameInput.addEventListener("input", nameCheck);

emailInput.addEventListener("blur", emailCheck);
emailInput.addEventListener("input", emailCheck);

messageInput.addEventListener("blur", messageCheck);
messageInput.addEventListener("input", messageCheck);


const allInputsCheck = () => {
    if(inputsValidity.name && inputsValidity.email && inputsValidity.message) {
        submitButton.disabled = false;
        submitButton.classList.remove("disabled");
    } else {
        submitButton.disabled = true;
        submitButton.classList.add("disabled");
    }
};
form.addEventListener("input", allInputsCheck);

const resultContainer = document.getElementById('result');

 form.addEventListener("submit", function(e) {
    e.preventDefault();

       if (inputsValidity.name && inputsValidity.email && inputsValidity.message) {
            grecaptcha.ready(function () {
                grecaptcha.execute('6LdDuDkrAAAAAE-Kd567wFLfK0kaTVSx21hlSQt4', { action: 'submit' }).then(function (token) {
                    const formData = {
                        nom: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        message: messageInput.value.trim(),
                        recaptchaToken: token
                    };

            submitButton.disabled = true;
            submitButton.textContent = "Envoi...";
            submitButton.classList.add("disabled");

            

            function resetSubmitButton() {
                submitButton.disabled = true;
                submitButton.textContent = "ENVOYER";
                submitButton.classList.remove("disabled");
            }

        fetch(`${apiUrl}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)

        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur réseau");
                }
                return response.json();
            })
        
            .then(data => {
                resultContainer.textContent = 'Message envoyé avec succès !';
                resultContainer.className = 'success';
                console.log("réponse du serveur:", data)
                form.reset();
                inputsValidity.name = false;
                inputsValidity.email = false;
                inputsValidity.message = false;
                
            })
            .catch(error => {
                console.error('Erreur au moment de l\'envoi :', error);
                resultContainer.textContent = 'Erreur lors de l\'envoie du message. Merci de bien vouloir réessayer.';
                resultContainer.className = 'error';
            })
            .finally(() => {
                resetSubmitButton();
            });
        });
    });
}
});  
}
