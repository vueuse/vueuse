// eslint-disable-next-line no-restricted-imports
import type { Ref } from 'vue'
import { onBeforeUnmount, ref } from 'vue-demi'

/**
 * Type definition for the composable return values
 */
interface UseOTPAutoFillReturn {
  otp: Ref<string>
  fetchOTP: () => void
}

/**
 * Composable to handle OTP autofill using the OTPCredentials API
 * This composable automatically requests the OTP via SMS when mounted
 * and provides a ref that contains the OTP value.
 */
export function useOTP(): UseOTPAutoFillReturn {
  const otp = ref<string>('') // Ref to store the OTP value
  const abortController = ref<AbortController | null>(null) // To abort OTP requests if needed

  /**
   * Internal function to handle the filled OTP and set it to the ref
   * @param otpCode The OTP code received
   */
  const handleOTPFilled = (otpCode: string) => {
    otp.value = otpCode
  }

  /**
   * Function to request OTP via the OTPCredentials API
   */
  const fetchOTP = () => {
    // Check if the browser supports the OTPCredentials API
    if (!('OTPCredential' in window)) {
      console.warn('OTPCredentials API is not supported by this browser.')
      return
    }

    // Initialize a new AbortController to manage cancellation of the OTP request
    abortController.value = new AbortController()

    navigator.credentials
      .get({
        otp: { transport: ['sms'] }, // Specify transport method as SMS
        signal: abortController.value.signal, // Attach the abort signal
      })
      .then((otpCredential: OTPCredential | null) => {
        if (otpCredential) {
          handleOTPFilled(otpCredential.code) // Extract and set the OTP code
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          console.error('OTP request was aborted.')
        }
        else {
          console.error('Error fetching OTP:', err)
        }
      })
  }

  /**
   * Cleanup function to abort the OTP request when the component is unmounted
   */
  onBeforeUnmount(() => {
    abortController.value?.abort()
  })

  return {
    otp,
    fetchOTP,
  }
}
