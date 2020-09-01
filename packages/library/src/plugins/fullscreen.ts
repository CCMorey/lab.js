export default class FullscreenPlugin {
  options: any;
  constructor({
    message,
    hint,
    close
  }: any={}) {
    this.options = {
      message: message || 'This experiment requires full screen display',
      hint: hint || 'Please click to continue in full screen mode',
      close: close ?? true,
    }
  }

  async handle(context: any, event: any) {
    if (event === 'before:run' && !document.fullscreenElement) {
      // Create and show overlay (sorry Merle, no Alpacas here :-/ )
      const overlay = document.createElement('div')
      overlay.innerHTML = `
        <div
          class="modal w-m content-horizontal-center content-vertical-center text-center"
        >
          <p>
            <span class="font-weight-bold">
              ${ this.options.message }
            </span><br>
            <span class="text-muted">
              ${ this.options.hint }
            </span>
          </p>
        </div>
      `
      overlay.classList.add(
        'overlay',
        'content-vertical-center',
        'content-horizontal-center'
      )
      document.body.appendChild(overlay)

      // Halt all activity until confirmation of the fullscreen switch
      // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
      await new Promise((resolve: any) => {
        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        overlay.addEventListener('click', async e => {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'lab'.
          await lab.util.fullscreen.launch(document.documentElement)
          document.body.removeChild(overlay)
          resolve()
        }, { once: true })
      })
    } else if (event === 'end' && this.options.close) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'lab'.
      lab.util.fullscreen.exit()
    }
  }
}