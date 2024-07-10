/**
 * nethone init code for profiling
 */
export const useInitNethone = () => {
  const nethoneAttemptReference = useState<string>('nethoneAttemptReference')

  // set behavioral data parameters
  const options = {
    attemptReference: nethoneAttemptReference.value,
    sensitiveFields: ['ccn', 'cvv'],
    secretFields: ['password'],
  }

  // log to check
  if (import.meta.env.DEV) {
    const msg = `Generated "attemptReference" value for Nethone: ${options.attemptReference}`
    console.info(msg)
  }

  // @ts-ignore
  if (window.dftp) {
    // @ts-ignore
    dftp.init(options)

    // TODO: delete this else block later on since we can guarantee that the script will be ready/loaded by the time we call `dftp.init()`
  } else {
    const el = document.getElementById('nethone_script')
    if (el) {
      el.addEventListener('load', () => {
        // @ts-ignore
        dftp.init(options)
      })
    } else {
      console.error(
        "Unable to find Nethone script tag with id 'nethone_script'"
      )
    }
  }
}
