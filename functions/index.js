const functions = require('firebase-functions');
const admin = require('firebase-admin');
const urlBuilder = require('build-url');
const request = require('request-promise');

admin.initializeApp(functions.config().firebase);

exports.postDynamicLink = functions.database.ref('Posts/{postId}')
    .onWrite(event => {
        let post = event.data.val();
        const postId = event.params.postId;

        if (post.addedDynamicLink) {
            return;
        }

        post.addedDynamicLink = true;

        const socialDescription = `Arvana Blog - ${post.title}`;
        const socialImageUrl = "http://res.cloudinary.com/jokam/image/upload/v1498378886/ar_blog_qeqjzu.png";

        const options = {
            method: 'POST',
            uri: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${functions.config().applinks.key}`,
            body: {
                "longDynamicLink": makeDynamicLongLink(postId, socialDescription, socialImageUrl)
            },
            json: true
        };

        request(options)
            .then(function (parsedBody) {
                console.log(parsedBody);
                return parsedBody.shortLink;
            })
            .then((shortLink) => {
                post.shareUrl = shortLink;
                console.log('short link: ' + shortLink);
                return event.data.ref.set(post);
            })

    });

function makeDynamicLongLink(postId, socialDescription, socialImageUrl) {
    return urlBuilder(`${functions.config().applinks.link}`, {
        queryParams: {
            link: "https://www.arvana.io/code/" + postId,
            apn: "io.arvana.blog",
            dfl: "https://www.arvana.io",
            st: "Arvana Blog - All you need to know about arvana",
            sd: socialDescription,
            si: socialImageUrl
        }
    });
}