package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.selection.selectable
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.ui.theme.*

@Composable
fun ProviderAvailabilityScreen(
    currentStatus: String = "AVAILABLE",
    isLoading: Boolean,
    errorMessage: String?,
    onStatusChange: (newStatus: String) -> Unit
) {
    var selectedStatus by remember { mutableStateOf(currentStatus) }

    val options = listOf(
        Triple("AVAILABLE", "Online & Ready for Jobs", "Receive real-time customer leads within your coverage radius"),
        Triple("BUSY", "Currently on a Job", "Temporarily pause new immediate leads while working"),
        Triple("OFFLINE", "Offline / Not Working", "No customer requests will be dispatched until you return")
    )

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
                    text = "Work Availability",
                    color = KaamTextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Control your job dispatch status instantly without losing your profile standing.",
                    color = KaamTextSecondary,
                    fontSize = 15.sp
                )

                Spacer(modifier = Modifier.height(24.dp))

                options.forEach { (statusKey, title, description) ->
                    val isSelected = selectedStatus == statusKey
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp)
                            .selectable(
                                selected = isSelected,
                                onClick = {
                                    selectedStatus = statusKey
                                    onStatusChange(statusKey)
                                },
                                role = Role.RadioButton
                            ),
                        shape = MaterialTheme.shapes.medium,
                        colors = CardDefaults.cardColors(containerColor = KaamSurface),
                        border = BorderStroke(
                            width = if (isSelected) 2.dp else 1.dp,
                            color = when {
                                isSelected && statusKey == "AVAILABLE" -> KaamSuccess
                                isSelected && statusKey == "BUSY" -> KaamWarning
                                isSelected -> KaamPrimary
                                else -> KaamSurfaceBorder
                            }
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = title,
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = when {
                                        isSelected && statusKey == "AVAILABLE" -> KaamSuccess
                                        isSelected && statusKey == "BUSY" -> KaamWarning
                                        isSelected -> KaamPrimary
                                        else -> KaamTextPrimary
                                    }
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = description,
                                    fontSize = 13.sp,
                                    color = KaamTextSecondary
                                )
                            }
                            RadioButton(
                                selected = isSelected,
                                onClick = null,
                                colors = RadioButtonDefaults.colors(
                                    selectedColor = if (statusKey == "AVAILABLE") KaamSuccess else KaamPrimary
                                )
                            )
                        }
                    }
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

            Text(
                text = "Changes take effect immediately across all customer discovery queries.",
                color = KaamTextSecondary,
                fontSize = 12.sp,
                modifier = Modifier.padding(bottom = 16.dp)
            )
        }
    }
}
