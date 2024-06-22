// main.js
const nodemailer = require('nodemailer');

// configure option
const option = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "amonino.app@gmail.com",
    pass: "itksmmafkbrldnih",
  },
};

const transporter = nodemailer.createTransport(option);

// send email
const sendEmail = async ({ to, subject, text, html, ...rest }) => {
  try {
    const res = await transporter.verify();
    if (res) {
      //config mail
      const mail = {
        //sender access
        from: "<no-reply@accounts.english247.herokuapp.com>",
        //receiver access
        to,
        //subject
        subject,
        //content text
        text,
        //html
        html,
        //others
        ...rest,
      };
      //Tiến hành gửi email
      const info = await transporter.sendMail(mail);
      if (info) {
        return true;
      }
    }
  } catch (err) {
    console.error("ERROR MAILER: ", err);
    return false;
  }
};

const headerHtmlMail = `<h1 style="color: #018c4c; font-size: 48px; border-bottom: solid 2px #ccc;padding-bottom: 10px">
      Learn English<br />
    </h1>`;
const footerHtmlVerifyMail = `<h3 style="color: red">
        Chú ý: Không đưa mã này cho bất kỳ ai,
        có thể dẫn đến mất tài khoản.<br />
        Mã chỉ có hiệu lực <i>10 phút </i> từ khi bạn nhận được mail.
    </h3>
    <h1>Cảm ơn.</h1>`;

// gửi mã xác nhận
const htmlSignupAccount = (token) => {
  return `<div>
    ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin chào anh (chị),<br />
        Mã xác nhận đăng ký tài khoản cho website Learn English của bạn.<br />
        Cảm ơn vì đã ghé thăm TTB Store <3
    </h2>
    <h3 style="background: #eee;padding: 10px;">
      <i><b>${token}</b></i>
    </h3>
  ${footerHtmlVerifyMail}
  </div>`;
};

// thông báo trở thành đóng góp viên cho amonino
const htmlContributor = () => {
  return `<div>
    ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin chào anh (chị), 😍<br />
        Chúc mừng bạn đã trở thành đóng góp viên cho Amonino.<br />
        Cảm ơn bạn đã đóng góp cho cộng đồng học tiếng Anh của chúng tôi ♥️.
    </h2>
    <h1>Cảm ơn.</h1>
  </div>`;
};

// thông báo bị thu hồi quyền đóng góp viên, cảm ơn
const htmlContributorRevoke = () => {
  return `<div>
    ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin chào anh (chị),<br />
        Quyền đóng góp viên của bạn đã bị thu hồi.<br />
        Cảm ơn bạn đã đóng góp cho cộng đồng học tiếng Anh của chúng tôi ♥️.
    </h2>
    <h1>Cảm ơn.</h1>
  </div>`;
};

// gửi mã đổi mật khẩu
const htmlResetPassword = (token) => {
  return `<div>
    ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin chào anh (chị),<br />
        Amonino đã nhận được yêu cầu lấy lại mật khẩu từ bạn.<br />
        Đừng lo lắng, hãy nhập mã này để khôi phục:
    </h2>
    <h1 style="background: #eee;padding: 10px;">
      <i><b>${token}</b></i>
    </h1>
    ${footerHtmlVerifyMail}
  </div>`;
};

// gửi thông báo đăng nhập sai quá nhiều
const htmlWarningLogin = () => {
  return `<div>
   ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin Chào anh (chị),<br />
        Cửa hàng nghi ngờ có ai đó đã cố gắng đăng nhập vào tài khoản của quý khách.<br />
        Nếu quý khác không nhớ mật khẩu hãy nhấn vào "Quên mật khẩu" để lấy lại mật khẩu<br/>
    </h2>
    <h1>Cảm ơn.</h1>
  </div>`;
};

module.exports = {
  sendEmail,
  htmlSignupAccount,
  htmlResetPassword,
  htmlWarningLogin,
  htmlContributor,
  htmlContributorRevoke,
};
