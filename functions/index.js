const functions = require('firebase-functions');
const admin = require('firebase-admin');
const urlBuilder = require('build-url');

admin.initializeApp(functions.config().firebase);

exports.postDynamicLink = functions.database.ref('Posts/{postId}')
    .onWrite(event => {
        let post = event.data.val();
        const postId = event.params.postId;

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