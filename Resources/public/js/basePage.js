var basePageView = Backbone.View.extend({

    events: {
        "submit form.async": "submitForm"
    },

    /*
     * initialize some things.
     */
    initialize: function () {
        this.setElement($('body > .container').get(0));
    },

    loader: function (remove) {

        if (remove) {
            $(".loader").remove();
            return false;
        }

        $("body")
            .append($('<div/>', {
                "class": "loader",
                "html": '<img src="/bundles/teocore/images/loader50.gif" />'
            }));
    },

    submitForm: function (event) {

        this.loader();

        var post_url = $(event.currentTarget).attr('action');
        var post_data = $(event.currentTarget).serialize();
        var scope = this;

        $.ajax({
            url: post_url,
            data: post_data,
            type: 'POST',
            statusCode: {
                200: function (jqXHR) {
                    scope.feedback("Thank you");
                    scope.formLoader(true);
                }
            }
        })

        return false;
    },

    feedback: function (message) {
        $(document.body).find('#feedback').remove();

        $(document.body).append($('<div/>', {
            id: 'feedback',
            "class": "feedback",
            style: "display:none;"
        }));

        $("#feedback")
            .append($('<p/>', {
                html: message
            }))
            .append($('<a/>', {
                "class": "close",
                html: '&times;',
                href: "javascript:;",
                onclick: "$('#feedback').remove()"
            }))
            .fadeIn()
        ;

        setTimeout(function () {
            $("#feedback").fadeOut(function () {
                $(this).remove();
            });
        }, 5000);
    }
});