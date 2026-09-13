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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PhoneAuthScreen(
    isLoading: Boolean,
    errorMessage: String?,
    onRequestOtp: (String) -> Unit
) {
    var rawPhone by remember { mutableStateOf("") }
    val isValidPhone = rawPhone.length == 10 && rawPhone.all { it.isDigit() } && rawPhone.first() in '6'..'9'

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
                    text = stringResource(R.string.login_title),
                    color = KaamTextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = stringResource(R.string.login_subtitle),
                    color = KaamTextSecondary,
                    fontSize = 15.sp
                )

                Spacer(modifier = Modifier.height(32.dp))

                // Mobile number input field with fixed +91 prefix
                OutlinedTextField(
                    value = rawPhone,
                    onValueChange = { input ->
                        val digits = input.filter { it.isDigit() }
                        if (digits.length <= 10) {
                            rawPhone = digits
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text(stringResource(R.string.phone_label)) },
                    placeholder = { Text(stringResource(R.string.phone_hint)) },
                    leadingIcon = {
                        Text(
                            text = stringResource(R.string.phone_prefix) + " ",
                            color = KaamTextPrimary,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(start = 12.dp)
                        )
                    },
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.NumberPassword,
                        imeAction = if (isValidPhone) ImeAction.Done else ImeAction.None
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = {
                            if (isValidPhone && !isLoading) {
                                onRequestOtp("+91$rawPhone")
                            }
                        }
                    ),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = KaamPrimary,
                        unfocusedBorderColor = KaamSurfaceBorder,
                        focusedLabelColor = KaamPrimary
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

                Spacer(modifier = Modifier.height(24.dp))

                // Mandatory Trust Baseline Notice
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = KaamSurface),
                    border = androidx.compose.foundation.BorderStroke(1.dp, KaamSurfaceBorder)
                ) {
                    Text(
                        text = stringResource(R.string.trust_disclaimer),
                        color = KaamTextSecondary,
                        fontSize = 12.sp,
                        lineHeight = 16.sp,
                        modifier = Modifier.padding(12.dp)
                    )
                }
            }

            // Button with 52dp height for accessibility
            Button(
                onClick = { onRequestOtp("+91$rawPhone") },
                enabled = isValidPhone && !isLoading,
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
                        text = stringResource(R.string.btn_get_otp),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = KaamSurface
                    )
                }
            }
        }
    }
}
