package in.kaamsaathi.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import in.kaamsaathi.app.ui.screens.*
import in.kaamsaathi.app.ui.theme.KaamSaathiTheme

enum class AppDestination {
    LANGUAGE_SELECTION,
    PHONE_AUTH,
    OTP_VERIFY,
    CUSTOMER_PROFILE,
    PROVIDER_ONBOARD,
    PROVIDER_COVERAGE,
    PROVIDER_RATES,
    PROVIDER_AVAILABILITY,
    PROVIDER_VERIFY,
    HOME
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            KaamSaathiTheme {
                var currentDestination by remember { mutableStateOf(AppDestination.LANGUAGE_SELECTION) }
                var currentLanguage by remember { mutableStateOf("hi") }
                var phoneNumber by remember { mutableStateOf("") }
                var maskedPhone by remember { mutableStateOf("+91 987****210") }
                var isLoading by remember { mutableStateOf(false) }
                var errorMessage by remember { mutableStateOf<String?>(null) }
                var currentProviderDistrict by remember { mutableStateOf("Lucknow") }

                when (currentDestination) {
                    AppDestination.LANGUAGE_SELECTION -> {
                        LanguageSelectionScreen(
                            currentLanguage = currentLanguage,
                            onLanguageSelected = { lang -> currentLanguage = lang },
                            onContinue = { currentDestination = AppDestination.PHONE_AUTH }
                        )
                    }
                    AppDestination.PHONE_AUTH -> {
                        PhoneAuthScreen(
                            isLoading = isLoading,
                            errorMessage = errorMessage,
                            onRequestOtp = { phone ->
                                phoneNumber = phone
                                maskedPhone = phone.take(6) + "****" + phone.takeLast(3)
                                currentDestination = AppDestination.OTP_VERIFY
                            }
                        )
                    }
                    AppDestination.OTP_VERIFY -> {
                        OtpVerificationScreen(
                            maskedPhone = maskedPhone,
                            isLoading = isLoading,
                            errorMessage = errorMessage,
                            onVerifyOtp = { _ ->
                                currentDestination = AppDestination.CUSTOMER_PROFILE
                            },
                            onResendOtp = {
                                // Resend triggered
                            }
                        )
                    }
                    AppDestination.CUSTOMER_PROFILE -> {
                        CustomerProfileScreen(
                            currentLanguage = currentLanguage,
                            initialData = null,
                            isLoading = isLoading,
                            errorMessage = errorMessage,
                            onSaveProfile = { _ ->
                                currentDestination = AppDestination.PROVIDER_ONBOARD
                            }
                        )
                    }
                    AppDestination.PROVIDER_ONBOARD -> {
                        ProviderOnboardingScreen(
                            isLoading = isLoading,
                            errorMessage = errorMessage,
                            onSubmitOnboarding = { data ->
                                currentProviderDistrict = data.district
                                currentDestination = AppDestination.PROVIDER_COVERAGE
                            }
                        )
                    }
                    AppDestination.PROVIDER_COVERAGE -> {
                        ProviderCoverageScreen(
                            initialDistrict = currentProviderDistrict,
                            initialRadiusKm = 15,
                            isLoading = isLoading,
                            errorMessage = errorMessage,
                            onSaveCoverage = { district, _ ->
                                currentProviderDistrict = district
                                currentDestination = AppDestination.PROVIDER_RATES
                            }
                        )
                    }
                    AppDestination.PROVIDER_RATES -> {
                        ProviderRatesScreen(
                            initialFeeRupees = "150",
                            isLoading = isLoading,
                            errorMessage = errorMessage,
                            onSaveRates = { _, _ ->
                                currentDestination = AppDestination.PROVIDER_AVAILABILITY
                            }
                        )
                    }
                    AppDestination.PROVIDER_AVAILABILITY -> {
                        ProviderAvailabilityScreen(
                            currentStatus = "AVAILABLE",
                            isLoading = isLoading,
                            errorMessage = errorMessage,
                            onStatusChange = { _ ->
                                currentDestination = AppDestination.PROVIDER_VERIFY
                            }
                        )
                    }
                    AppDestination.PROVIDER_VERIFY -> {
                        ProviderVerificationScreen(
                            currentBadges = listOf("PHONE_VERIFIED" to "Phone Number Verified"),
                            isLoading = isLoading,
                            errorMessage = errorMessage,
                            onSubmitEvidence = { _, _ ->
                                currentDestination = AppDestination.HOME
                            }
                        )
                    }
                    AppDestination.HOME -> {
                        // Home screen
                        LanguageSelectionScreen(
                            currentLanguage = currentLanguage,
                            onLanguageSelected = { currentLanguage = it },
                            onContinue = { currentDestination = AppDestination.CUSTOMER_PROFILE }
                        )
                    }
                }
            }
        }
    }
}
