import Logo from './Logo'

const Footer = (): JSX.Element => {
  return (
    <footer className="footer">
      <div className={'container'}>
        <div className={'row'}>
          <div className={'col-2'}>
            <Logo/>
          </div>
          <div className={'col-10'}>
            <p className="text-muted">
              <a href="https://git.esi-bru.be/pbt/displaytimetable"
                 target="_blank">
                <i className="fa fa-gitlab"
                   aria-hidden="true"/> Dépôt <i>gitesi</i>
              </a>
              <br/>
              <a
                href="mailto:esi-horaires@he2b.be?subject=Mail from horaires.esi-bru.be /">
                <i className="fa fa-paper-plane" aria-hidden="true"/> Contact
                horaires
              </a>
            </p>
            <p className="text-muted"><i>Fait à l'arrache pour l'ESI par Pierre,
              Nicolas (<i>Némo</i>) et Frédéric
              (<i>Sébastien</i>).</i></p>
            <p className="text-muted small">
              <a
                href="https://git.esi-bru.be/pbt/displaytimetable/-/raw/master/LICENSE">MIT
                licence</a> - 2020-2021
            </p>
          </div>
        </div>
      </div>

    </footer>

  )
}

export default Footer
