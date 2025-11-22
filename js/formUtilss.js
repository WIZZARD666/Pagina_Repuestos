// Reusable form utilities: validation and form timer
window.FormUtils = (function () {
    const TIEMPO_LIMITE_DEFAULT = 60000; // 1 minuto
    let temporizador = null;

    function isNotEmpty(val) {
        return String(val || '').trim().length > 0;
    }

    function isAlphaSpace(val) {
        // Permite letras (incluyendo Ñ/acentos) y espacios
        if (!isNotEmpty(val)) return false; 
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(String(val));
    }

    function isCedula(val) {
        const v = String(val || '').replace(/\D/g, '');
        if (!isNotEmpty(val)) return false; 
        return v.length >= 6 && v.length <= 10;
    }

    function isPhone(val) {
        const v = String(val || '').replace(/\D/g, '');
        if (!isNotEmpty(val)) return false; 
        return v.length >= 7 && v.length <= 12;
    }

    function startFormTimer(timeout = TIEMPO_LIMITE_DEFAULT, onTimeout) {
        stopFormTimer();
        temporizador = setTimeout(() => {
            temporizador = null;
            try { if (typeof onTimeout === 'function') onTimeout(); } catch(e){console.error(e)}
        }, timeout);
        console.log('Form timer started for', timeout, 'ms');
    }

    function stopFormTimer() {
        if (temporizador) {
            clearTimeout(temporizador);
            temporizador = null;
            console.log('Form timer stopped');
        }
    }

    // Función para aplicar la validación y el feedback visual en un campo
    function checkAndToggleValidation($input, rule) {
        const val = $input.val();
        const valid = rule.validator(val);
        
        $input.toggleClass('is-invalid', !valid).toggleClass('is-valid', !!valid);
        
        const $feedback = $input.nextAll('.invalid-feedback').first(); 
        
        if (!valid) {
            $feedback.text(rule.message || 'El campo es obligatorio o tiene un formato incorrecto.').show();
        } else {
            $feedback.text('').hide();
        }
        return valid;
    }

    /**
     * Adjunta validación en tiempo real a los inputs
     */
    function attachRealtimeValidation(formSelector, rules) {
        const $form = $(formSelector);
        if (!$form.length) return;

        Object.keys(rules || {}).forEach((field) => {
            const rule = rules[field];
            const $input = $form.find(`#${field}`);

            $input.on('input change blur', function () {
                checkAndToggleValidation($(this), rule);
            });
        });
    }

    /**
     * Valida todos los campos de un formulario usando las reglas definidas.
     * @returns {boolean} True si todos los campos son válidos, False si no.
     */
    function validateForm(formSelector, rules) {
        const $form = $(formSelector);
        if (!$form.length) return false;

        let isValid = true;

        Object.keys(rules || {}).forEach((field) => {
            const rule = rules[field];
            const $input = $form.find(`#${field}`);
            
            // Si checkAndToggleValidation retorna False, el campo es inválido.
            if (!checkAndToggleValidation($input, rule)) {
                isValid = false; 
            }
        });

        return isValid;
    }

    return {
        isNotEmpty,
        isAlphaSpace,
        isCedula,
        isPhone,
        startFormTimer,
        stopFormTimer,
        attachRealtimeValidation,
        validateForm, // <-- Agregada para el control del submit
        TIEMPO_LIMITE_DEFAULT
    };
})();
