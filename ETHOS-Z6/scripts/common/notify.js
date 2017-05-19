(function () {
    $.noty.defaults = _.extend({}, $.noty.defaults, {
        layout: 'center',
        theme: 'metroui', // or relax or defaultTheme
        type: 'alert', 
        timeout: 1000,
        modal: true,
        killer: true,
    });

    app.notify = {
        error: function (error) {
            app.utils.loading(false);
            //console.error(error);
            //console.trace();
            var message = error || error //JSON.stringify(error);
            noty({ text: message, type: 'error' })
        },
        info: function (text) {
            noty({ text: text });
        },
        success: function (text) {
            noty({ text: text, type: 'success' })
        },
        warning: function (text) {
            noty({ text: text, type: 'warning' })
        },
        confirmation: function (text,callback) {
            text = text || 'Are you sure?';
            noty({
                text: text,
                layout: 'centerLeft' ,
                buttons: [ 
                  {
                      addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                          $noty.close();
                         // noty({ text: 'You clicked "Cancel" button', type: 'error' });
                      }
                  },
                  {
                      addClass: 'btn btn-primary', text: 'Confirm', onClick: function ($noty) {
                          $noty.close();
                          return callback(1);
                      }
                  }
                ]
            });
        },

        confirmationwithoutcancel: function (text, callback) {
            text = text || 'Are you sure?';
            noty({
                text: text,
                layout: 'centerLeft',
                buttons: [ 
                  {
                      addClass: 'btn btn-primary', text: 'Confirm', onClick: function ($noty) {
                          $noty.close();
                          return callback(1);
                      }
                  }
                ]
            });
        }
    };
}());
