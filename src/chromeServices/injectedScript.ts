import $ from 'jquery';

(function() {
    // Ensure jQuery is available
    if ($ !== undefined && $.fn !== undefined) {

    const scripts = document.querySelectorAll('script');
    
    scripts.forEach(script => {
        // Check if the script contains the specific line of code
        if (script.textContent && script.textContent.includes('companyId = e.val;')) {
          // Modify the content of the script
          console.log('Injecting script into the webpage');
          const modifiedScriptContent = script.textContent.replace('companyId = e.val;', 'companyId = e.target.value;');
          const modifiedScript = document.createElement('script');
          modifiedScript.textContent = modifiedScriptContent;
          document.body.appendChild(modifiedScript);
        }
    });

    } else {
      console.error('jQuery is not available on the context page.');
    }
  })();