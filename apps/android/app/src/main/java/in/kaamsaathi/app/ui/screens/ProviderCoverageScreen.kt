package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.R
import in.kaamsaathi.app.data.models.UP_DISTRICTS
import in.kaamsaathi.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProviderCoverageScreen(
    initialDistrict: String = "Lucknow",
    initialRadiusKm: Int = 15,
    isLoading: Boolean,
    errorMessage: String?,
    onSaveCoverage: (district: String, radiusKm: Int) -> Unit
) {
    var district by remember { mutableStateOf(initialDistrict) }
    var radiusKm by remember { mutableFloatStateOf(initialRadiusKm.toFloat()) }
    var districtExpanded by remember { mutableStateOf(false) }

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
                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "Operational Service Area",
                    color = KaamTextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Select your base district in Uttar Pradesh and service radius",
                    color = KaamTextSecondary,
                    fontSize = 15.sp
                )

                Spacer(modifier = Modifier.height(24.dp))

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
                        label = { Text("Base UP District") },
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

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = "Service Radius: ${radiusKm.toInt()} km",
                    color = KaamTextPrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Radius Slider (1 to 50 km)
                Slider(
                    value = radiusKm,
                    onValueChange = { radiusKm = it },
                    valueRange = 1f..50f,
                    steps = 48,
                    colors = SliderDefaults.colors(
                        thumbColor = KaamPrimary,
                        activeTrackColor = KaamPrimary,
                        inactiveTrackColor = KaamSurfaceBorder
                    )
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("1 km", fontSize = 12.sp, color = KaamTextSecondary)
                    Text("25 km", fontSize = 12.sp, color = KaamTextSecondary)
                    Text("50 km", fontSize = 12.sp, color = KaamTextSecondary)
                }

                if (errorMessage != null) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = errorMessage,
                        color = KaamError,
                        fontSize = 14.sp
                    )
                }
            }

            Button(
                onClick = { onSaveCoverage(district, radiusKm.toInt()) },
                enabled = !isLoading,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = KaamPrimary),
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
                        text = "Save Service Area",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = KaamSurface
                    )
                }
            }
        }
    }
}
