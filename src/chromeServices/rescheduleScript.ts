import $ from 'jquery';

(function() {
    // Ensure jQuery is available
    if ($ !== undefined && $.fn !== undefined) {

      const rescheduleForm = document.getElementById('reschedule-order-form');

      if(rescheduleForm) {
        console.log('Injecting reschedule script into the webpage');

        $('#reschedule-order-continue').on('click', function(e) {
        //$('#reschedule-order').on('click', function(e) {
          const dataArray = $('#reschedule-order-form').serializeArray();
          const dataJson = dataArray.reduce((acc: { [key: string]: any }, item) => {
            const propertyName = item.name.replace('[', '_').replace(']', '');
            acc[propertyName] = item.value;
            return acc;
          }, {});


          const documentBodyInnerHtml = document.body.innerHTML;
          const split1 = documentBodyInnerHtml?.split('File Number</label>')[1];
          const split2 = split1?.split('</div>')[0];
          const fileNumber = split2.split(">\n")[1];
          const cleanFileNumber = fileNumber.replace(/\s/g, '');

          const optionElement = document.querySelector(`option[value="${dataJson.signing_address_zone_id}"]`);
          
          dataJson.fileNumber = cleanFileNumber;
          dataJson.state = optionElement?.textContent?.replace(/\s/g, '');
          const serializedData = JSON.stringify(dataJson);
          $.ajax({
            'type': 'POST',
            'dataType': 'json',
            'url': process.env.REACT_APP_RESCHEDULE_ENDPOINT_URL, //TODO Replace with the apim URL
            'data': serializedData,
            'beforeSend': function(xhr) {
              const subscriptionKey = process.env.REACT_APP_RESCHEDULE_SUBSCRIPTION_KEY;
              if (!subscriptionKey) {
                throw new Error('REACT_APP_RESCHEDULE_SUBSCRIPTION_KEY is not defined');
              }
              xhr.setRequestHeader('Subscription-Key', subscriptionKey); //TODO Replace with the apim subscription key
              xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            },
            "success": function (data) {
                if (data.success === true) {
                    console.log(data);
                } else {
                    console.log(data);
                }
            },
            "error": function (data) {
                console.log(data);
            }
          });

        });

      }

    } else {
      console.error('jQuery is not available on the context page.');
    }
  })();