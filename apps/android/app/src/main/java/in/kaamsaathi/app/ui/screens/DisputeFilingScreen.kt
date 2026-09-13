package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DisputeFilingScreen(
    bookingId: String,
    isHindi: Boolean = true,
    onBack: () -> Unit,
    onSubmitDispute: (reason: String, description: String) -> Unit,
    onEmergencyCall: (number: String) -> Unit
) {
    val reasons = listOf(
        "POOR_QUALITY" to if (isHindi) "खराब काम (Poor Quality)" else "Poor Quality",
        "OVERCHARGING" to if (isHindi) "अतिरिक्त शुल्क (Overcharging)" else "Overcharging",
        "NO_SHOW" to if (isHindi) "मिस्त्री नहीं पहुंचे (No Show)" else "No Show",
        "UNPROFESSIONAL_BEHAVIOUR" to if (isHindi) "अनुचित व्यवहार (Unprofessional)" else "Unprofessional Behaviour",
        "DAMAGE_OR_LOSS" to if (isHindi) "सामान की क्षति (Damage / Loss)" else "Damage / Loss",
        "OTHER" to if (isHindi) "अन्य समस्या (Other Issue)" else "Other"
    )

    var selectedReason by remember { mutableStateOf(reasons.first().first) }
    var description by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            TopAppBar(
                title = {
                    Text(
                        text = if (isHindi) "शिकायत या विवाद दर्ज करें" else "File a Complaint / Dispute",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                },
                navigationIcon = {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier.size(48.dp)
                    ) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = KaamSurface,
                    titleContentColor = KaamTextPrimary
                )
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Critical Emergency Hotline Banner
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2))
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Warning,
                                contentDescription = "Emergency Safety Warning",
                                tint = Color(0xFFDC2626),
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (isHindi) "आपातकालीन सुरक्षा सहायता" else "Emergency Safety Assistance",
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF991B1B)
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = if (isHindi)
                                "यदि आप किसी तात्कालिक खतरे, हिंसा या अपराध का सामना कर रहे हैं, तो तुरंत उत्तर प्रदेश आपातकालीन सेवाओं को डायल करें:"
                            else
                                "If you are in immediate physical danger, harassment, or witnessing a crime, dial Uttar Pradesh Emergency Services immediately:",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(0xFF7F1D1D),
                            lineHeight = 18.sp
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = { onEmergencyCall("112") },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDC2626)),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f).height(48.dp)
                            ) {
                                Icon(Icons.Default.Call, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("UP 112 (Police)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                            Button(
                                onClick = { onEmergencyCall("1090") },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF9333EA)),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f).height(48.dp)
                            ) {
                                Icon(Icons.Default.Call, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("1090 (Women)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                // Dispute Reason Selection
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = KaamSurface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = if (isHindi) "विवाद का कारण चुनें" else "Select Dispute Reason",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = KaamTextPrimary
                        )
                        Spacer(modifier = Modifier.height(10.dp))

                        reasons.forEach { (code, label) ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                                    .clickable { selectedReason = code },
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = selectedReason == code,
                                    onClick = { selectedReason = code },
                                    colors = RadioButtonDefaults.colors(selectedColor = KaamPrimary)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = label,
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = KaamTextPrimary
                                )
                            }
                        }
                    }
                }

                // Description
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = KaamSurface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = if (isHindi) "समस्या का विस्तार से विवरण दें" else "Describe the Issue in Detail",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = KaamTextPrimary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = description,
                            onValueChange = { description = it },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(140.dp),
                            placeholder = {
                                Text(
                                    if (isHindi)
                                        "कृपया बताएं कि क्या हुआ (कम से कम 10 अक्षर)..."
                                    else
                                        "Please explain what happened (minimum 10 characters)..."
                                )
                            },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = KaamPrimary,
                                unfocusedBorderColor = KaamOutline
                            )
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (description.trim().length < 10)
                                (if (isHindi) "कम से कम 10 अक्षर आवश्यक हैं" else "Minimum 10 characters required")
                            else
                                "${description.length} characters",
                            style = MaterialTheme.typography.bodySmall,
                            color = if (description.trim().length < 10) Color(0xFFDC2626) else KaamTextSecondary
                        )
                    }
                }

                Spacer(modifier = Modifier.weight(1f, fill = false))

                // Submit Dispute Button
                val isFormValid = description.trim().length >= 10 && !isSubmitting
                Button(
                    onClick = {
                        isSubmitting = true
                        onSubmitDispute(selectedReason, description.trim())
                    },
                    enabled = isFormValid,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = KaamPrimary)
                ) {
                    Text(
                        text = if (isHindi) "विवाद सबमिट करें" else "Submit Dispute",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                }
            }
        }
    }
}
