// Requires
const ngrok = require('ngrok')
const NGROK_TOKEN = process.env.NGROK_TOKEN

class NgrokClass {
    static link = ""

    static generate = () => {
        ngrok.connect({
            proto: 'tcp', // http|tcp|tls, defaults to http
            addr: 3000,
            authtoken: NGROK_TOKEN, // your authtoken from ngrok.com
            region: 'in', // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
            onStatusChange: (status) => {
                if (status == "closed")
                    this.generate()
            }
        }).then(url => {
            this.link = url
        })
    }
}
NgrokClass.generate()

module.exports = NgrokClass