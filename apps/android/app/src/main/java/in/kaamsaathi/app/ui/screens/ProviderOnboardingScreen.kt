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
import in.kaamsaathi.app.data.models.ProviderOnboardData
import in.kaamsaathi.app.data.models.UP_DISTRICTS
import in.kaamsaathi.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProviderOnboardingScreen(
    isLoading: Boolean,
    errorMessage: String?,
    onSubmitOnboarding: (ProviderOnboardData) -> Unit
) {
    var selectedTrade by remember { mutableStateOf("electrician") }
    var experienceYears by remember { mutableStateOf("3") }
    var district by remember { mutableStateOf("Lucknow") }
    var serviceRadiusKm by remember { mutableStateOf("15") }
    var districtExpanded by remember { mutableStateOf(false) }

    val trades = listOf(
        "electrician" to stringResource(R.string.trade_electrician),
        "plumber" to stringResource(R.string.trade_plumber),
        "appliance_repair" to stringResource(R.string.trade_appliance)
    )

    val expInt = experienceYears.toIntOrNull() ?: 0
    val radiusInt = serviceRadiusKm.toIntOrNull() ?: 15
    val isValidForm = expInt >= 0 && radiusInt in 1..50

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
                    text = stringResource(R.string.provider_onboard_title),
                    color = KaamTextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = stringResource(R.string.provider_trade_label),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = KaamTextPrimary
                )

                Spacer(modifier = Modifier.height(8.dp))

                trades.forEach { (key, label) ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        colors = CardDefaults.cardColors(containerColor = KaamSurface),
                        border = androidx.compose.foundation.BorderStroke(
                            width = if (selectedTrade == key) 2.dp else 1.dp,
                            color = if (selectedTrade == key) KaamPrimary else KaamSurfaceBorder
                        ),
                        onClick = { selectedTrade = key }
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = label,
                                fontSize = 16.sp,
                                fontWeight = if (selectedTrade == key) FontWeight.Bold else FontWeight.Normal,
                                color = if (selectedTrade == key) KaamPrimary else KaamTextPrimary
                            )
                            RadioButton(
                                selected = selectedTrade == key,
                                onClick = { selectedTrade = key },
                                colors = RadioButtonDefaults.colors(selectedColor = KaamPrimary)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Experience Years
                OutlinedTextField(
                    value = experienceYears,
                    onValueChange = { input ->
                        val digits = input.filter { it.isDigit() }
                        if (digits.length <= 2) experienceYears = digits
                    },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text(stringResource(R.string.experience_label)) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = KaamPrimary,
                        unfocusedBorderColor = KaamSurfaceBorder
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                // UP District
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

                // Service Radius
                OutlinedTextField(
                    value = serviceRadiusKm,
                    onValueChange = { input ->
                        val digits = input.filter { it.isDigit() }
                        if (digits.length <= 2) serviceRadiusKm = digits
                    },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text(stringResource(R.string.service_radius_label)) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
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
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    onSubmitOnboarding(
                        ProviderOnboardData(
                            primaryTrade = selectedTrade,
                            experienceYears = expInt,
                            district = district,
                            serviceRadiusKm = radiusInt
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
                        text = stringResource(R.string.btn_submit_provider),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = KaamSurface
                    )
                }
            }
        }
    }
}
