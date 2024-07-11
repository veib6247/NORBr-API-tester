/**
 * nethone init code for profiling
 */
export const useInitNethone = async () => {
  const nethoneAttemptReference = useState<string>('nethoneAttemptReference')
  const isProfilingComplete = useState<boolean>('isProfilingComplete')

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

    try {
      // @ts-ignore
      await dftp.profileCompleted()
      isProfilingComplete.value = true

      //
    } catch (err) {
      console.error(`Profiling failed with err: ${err}`)
    }
  } else {
    alert(
      'Unable to initialize Nethone profiling script, please reload the page.'
    )
  }
}
