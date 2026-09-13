package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.R
import in.kaamsaathi.app.data.models.CustomerProfileData
import in.kaamsaathi.app.data.models.UP_DISTRICTS
import in.kaamsaathi.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerProfileScreen(
    currentLanguage: String,
    initialData: CustomerProfileData?,
    isLoading: Boolean,
    errorMessage: String?,
    onSaveProfile: (CustomerProfileData) -> Unit
) {
    var name by remember { mutableStateOf(initialData?.name ?: "") }
    var district by remember { mutableStateOf(initialData?.district ?: "Lucknow") }
    var locality by remember { mutableStateOf(initialData?.locality ?: "") }
    var pincode by remember { mutableStateOf(initialData?.pincode ?: "") }
    var districtExpanded by remember { mutableStateOf(false) }

    val isValidPincode = pincode.length == 6 &&
            pincode.all { it.isDigit() } &&
            (pincode.startsWith("20") || pincode.startsWith("21") || pincode.startsWith("22") ||
             pincode.startsWith("23") || pincode.startsWith("24") || pincode.startsWith("25") ||
             pincode.startsWith("26") || pincode.startsWith("27") || pincode.startsWith("28"))

    val isValidForm = name.trim().length >= 2 && locality.trim().length >= 2 && isValidPincode

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Start
            ) {
                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = stringResource(R.string.profile_title),
                    color = KaamTextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Name input
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text(stringResource(R.string.name_label)) },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = KaamPrimary,
                        unfocusedBorderColor = KaamSurfaceBorder
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                // UP District Dropdown
                ExposedDropdownMenuBox(
                    expanded = districtExpanded,
                    onExpandedChange = { districtExpanded = !districtExpanded },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = district,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text(stringResource(R.string.district_label)) },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = districtExpanded) },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = KaamPrimary,
                            unfocusedBorderColor = KaamSurfaceBorder
                        )
                    )
                    ExposedDropdownMenu(
                        expanded = districtExpanded,
                        onDismissRequest = { districtExpanded = false },
                        modifier = Modifier.background(KaamSurface)
                    ) {
                        UP_DISTRICTS.forEach { d ->
                            DropdownMenuItem(
                                text = { Text(d, color = KaamTextPrimary) },
                                onClick = {
                                    district = d
                                    districtExpanded = false
                                },
                                modifier = Modifier.heightIn(min = 48.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Locality / Area / Ward
                OutlinedTextField(
                    value = locality,
                    onValueChange = { locality = it },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text(stringResource(R.string.locality_label)) },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = KaamPrimary,
                        unfocusedBorderColor = KaamSurfaceBorder
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                // UP PIN Code
                OutlinedTextField(
                    value = pincode,
                    onValueChange = { input ->
                        val digits = input.filter { it.isDigit() }
                        if (digits.length <= 6) {
                            pincode = digits
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text(stringResource(R.string.pincode_label)) },
                    isError = pincode.isNotEmpty() && !isValidPincode,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = KaamPrimary,
                        unfocusedBorderColor = KaamSurfaceBorder
                    )
                )

                if (pincode.isNotEmpty() && !isValidPincode) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Enter a valid 6-digit UP PIN code (20xxxx to 28xxxx)",
                        color = KaamError,
                        fontSize = 12.sp
                    )
                }

                if (errorMessage != null) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = errorMessage,
                        color = KaamError,
                        fontSize = 14.sp
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Privacy Note Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = KaamSurface),
                    border = androidx.compose.foundation.BorderStroke(1.dp, KaamSurfaceBorder)
                ) {
                    Text(
                        text = stringResource(R.string.privacy_note),
                        color = KaamTextSecondary,
                        fontSize = 12.sp,
                        lineHeight = 16.sp,
                        modifier = Modifier.padding(12.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    onSaveProfile(
                        CustomerProfileData(
                            name = name.trim(),
                            district = district,
                            locality = locality.trim(),
                            pincode = pincode.trim(),
                            preferredLanguage = currentLanguage
                        )
                    )
                },
                enabled = isValidForm && !isLoading,
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
                        text = stringResource(R.string.btn_save_profile),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = KaamSurface
                    )
                }
            }
        }
    }
}
