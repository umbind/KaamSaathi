package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.R
import in.kaamsaathi.app.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun OtpVerificationScreen(
    maskedPhone: String,
    initialCooldownSeconds: Int = 60,
    isLoading: Boolean,
    errorMessage: String?,
    onVerifyOtp: (String) -> Unit,
    onResendOtp: () -> Unit
) {
    var otpCode by remember { mutableStateOf("") }
    var cooldownRemaining by remember { mutableIntStateOf(initialCooldownSeconds) }

    LaunchedEffect(cooldownRemaining) {
        if (cooldownRemaining > 0) {
            delay(1000L)
            cooldownRemaining -= 1
        }
    }

    val isValidCode = otpCode.length == 6 && otpCode.all { it.isDigit() }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Start
            ) {
                Spacer(modifier = Modifier.height(32.dp))

                Text(
                    text = stringResource(R.string.otp_title),
                    color = KaamTextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = stringResource(R.string.otp_subtitle, maskedPhone),
                    color = KaamTextSecondary,
                    fontSize = 15.sp
                )

                Spacer(modifier = Modifier.height(32.dp))

                // 6-digit OTP Input
                OutlinedTextField(
                    value = otpCode,
                    onValueChange = { input ->
                        val digits = input.filter { it.isDigit() }
                        if (digits.length <= 6) {
                            otpCode = digits
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("6-Digit Verification Code") },
                    placeholder = { Text("123456") },
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.NumberPassword,
                        imeAction = if (isValidCode) ImeAction.Done else ImeAction.None
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = {
                            if (isValidCode && !isLoading) {
                                onVerifyOtp(otpCode)
                            }
                        }
                    ),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = KaamPrimary,
                        unfocusedBorderColor = KaamSurfaceBorder
                    )
                )

                if (errorMessage != null) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = errorMessage,
                        color = KaamError,
                        fontSize = 14.sp
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Resend action with 60s cooldown enforcement
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (cooldownRemaining > 0) {
                        Text(
                            text = stringResource(R.string.otp_cooldown, cooldownRemaining),
                            color = KaamTextSecondary,
                            fontSize = 14.sp
                        )
                    } else {
                        TextButton(
                            onClick = {
                                cooldownRemaining = 60
                                onResendOtp()
                            },
                            modifier = Modifier.heightIn(min = 48.dp)
                        ) {
                            Text(
                                text = stringResource(R.string.otp_resend),
                                color = KaamPrimary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        }
                    }
                }
            }

            Button(
                onClick = { onVerifyOtp(otpCode) },
                enabled = isValidCode && !isLoading,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = KaamPrimary,
                    disabledContainerColor = KaamTextDisabled
                ),
                shape = MaterialTheme.shapes.medium
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        color = KaamSurface,
                        modifier = Modifier.size(24.dp),
                        strokeWidth = 2.dp
                    )
                } else {
                    Text(
                        text = stringResource(R.string.btn_verify),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = KaamSurface
                    )
                }
            }
        }
    }
}
