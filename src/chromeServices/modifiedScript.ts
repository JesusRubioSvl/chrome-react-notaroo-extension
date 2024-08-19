// Declare the functions and variables that are expected to be present in the context page
declare function updateRONVisibility(action: string): void;
declare function loadAddressBookForCompany(companyId: any, flag: boolean): void;
declare function getCustomSigningTypes(companyId: any): void;
declare let $: any; // Assuming jQuery is used


// This is the modified script content
const element = document.getElementById('client-user-select');
if (element) {
element.addEventListener('change', function(e: any) {
  const companyId = e.target.value;
  let hidden = '';
  if(companyId != null) {
      var option = $('[value=' + companyId + ']');
      var company_ron_signing_default = option.data('ron_signing_default');
      if (company_ron_signing_default === 3 || hidden == 'hidden') {
          if (!$('#ron-signing').hasClass('hidden')) {
              $('#ron-signing').addClass('hidden');
          }
      } else {
          $('#ron-signing').removeClass('hidden');
          $("#ron_signing-check-no").prop("checked", company_ron_signing_default===2);
          $("#ron_signing-check-yes").prop("checked", company_ron_signing_default===1);
          if (company_ron_signing_default === 2) {
              updateRONVisibility('hide');
          } else {
              updateRONVisibility('show');
          }
      }
      if ($("input[name='ron_signing_answer']:checked").val() == 1) {
          $('#ron-type').removeClass('hidden');
          $('#ron-time-zone').removeClass('hidden');
      } else {
          $('#ron-type').addClass('hidden');
          $('#ron-time-zone').addClass('hidden');
      }
      $(this).closest('.form-group').removeClass('has-error')
      loadAddressBookForCompany(companyId, true);
      getCustomSigningTypes(companyId);
  } else {
      $(this).closest('.form-group').addClass('has-error')
  }
});
}

export {};