const imageThumbnail = require("image-thumbnail");
const nodemailer = require("nodemailer");

module.exports = async function (context, myBlob) {
  context.log(
    "JavaScript blob trigger function processed blob \n Blob:",
    context.bindingData.blobTrigger,
    "\n Blob Size:",
    myBlob.length,
    "Bytes"
  );
  context.log(context.bindingData.name);
  //const name_ancien = context.bindingData.name
  //const new_name = name_ancien.slice(0, name_ancien.indexOf(".")) + "_thumb" + name_ancien.slice(name_ancien.indexOf("."), name_ancien.length)
  //context.log(new_name)
  const { blobTrigger } = context.bindingData;
  const name = blobTrigger.split("/")[1];
  const name_s = name.split(".").slice(0, -1).join(".");
  const name_ext = name.split(".").pop();
  const name_thumb = `${name_s}_thumb.${name_ext}`;
  context.bindingData.name = name_thumb;
  let options = { width: 100, height: 100 };
  const thumbnail = await imageThumbnail(myBlob, options);

  ///------------ ENVOYER UN MAIL --------------------//
  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.MDP,
    },
  });
  const pic = context.bindingData.blobTrigger;
  context.log(pic);
  const message = {
    from: process.env.EMAIL, // Sender address
    to: process.env.EMAIL, // List of recipients
    subject: "Tu as uploader une image", // Subject line
    attachments: [{ filename: "template", path: pic }], // Plain text body
  };
  transport.sendMail(message, function (err, info) {
    context.log("c ok !");
  });
  context.bindings.outputBlob = thumbnail;
  context.log(context.bindings.outputBlob.name);
};
