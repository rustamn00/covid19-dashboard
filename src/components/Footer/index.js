import './style.scss';

const Footer = () => {
  const footer = document.createElement('div');
  footer.className = 'footer';
  footer.innerHTML = `
        <div>Made with ❤️ @ <a href='https://rs.school/'>
            <img src='assets/img/rs_school_js.svg'>
        </a></div>
        <div class='mentor'>Mentor: 
            <a class='mentor' href='https://github.com/Munishkin'>
                @munishkin
            </a>
        </div>
        <div class='participants'>Students: 
            <a class='participant' href='https://github.com/burhonov'>
                @burhonov, 
            </a>
            <a class='participant' href='https://github.com/ergashevulugbek'>
                @ergashevulugbek, 
            </a>
            <a class='participant' href='https://github.com/rustamn00'>
                @rustam00
            </a>
        </div>
    `;

  return footer;
};

export default Footer;
