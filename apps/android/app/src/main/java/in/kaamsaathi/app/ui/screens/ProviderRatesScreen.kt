package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.ui.theme.*

@Composable
fun ProviderRatesScreen(
    currentCategory: String = "electrician",
    initialFeeRupees: String = "150",
    initialNotes: String = "",
    isLoading: Boolean,
    errorMessage: String?,
    onSaveRates: (feePaise: Int, notes: String) -> Unit
) {
    var feeRupees by remember { mutableStateOf(initialFeeRupees) }
    var notes by remember { mutableStateOf(initialNotes) }

    val feeInt = feeRupees.toIntOrNull()
    val isValidFee = feeInt != null && feeInt >= 0

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
                    text = "Service Rate Card & Inspection Fee",
                    color = KaamTextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Specify your transparent visitation & diagnostic fee. This fee is disclosed to customers before you are dispatched.",
                    color = KaamTextSecondary,
                    fontSize = 15.sp
                )

                Spacer(modifier = Modifier.height(24.dp))

                OutlinedTextField(
                    value = feeRupees,
                    onValueChange = { input ->
                        val digits = input.filter { it.isDigit() }
                        if (digits.length <= 4) feeRupees = digits
                    },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Standard Visitation / Diagnostic Fee (₹)") },
                    leadingIcon = {
                        Text("₹ ", fontWeight = FontWeight.Bold, color = KaamTextPrimary, modifier = Modifier.padding(start = 12.dp))
                    },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = KaamPrimary,
                        unfocusedBorderColor = KaamSurfaceBorder
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Pricing Details / Inclusions (Optional)") },
                    placeholder = { Text("e.g., Includes first 30 minutes of diagnostic inspection") },
                    minLines = 3,
                    maxLines = 4,
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

                Spacer(modifier = Modifier.height(24.dp))

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = KaamSurface),
                    border = androidx.compose.foundation.BorderStroke(1.dp, KaamSurfaceBorder)
                ) {
                    Text(
                        text = "Fair Pricing Rule: Visitation fees must be disclosed upfront. Additional labour or parts require explicit customer approval on-site before commencing work.",
                        color = KaamTextSecondary,
                        fontSize = 12.sp,
                        lineHeight = 16.sp,
                        modifier = Modifier.padding(12.dp)
                    )
                }
            }

            Button(
                onClick = {
                    if (isValidFee) {
                        onSaveRates(feeInt * 100, notes.trim())
                    }
                },
                enabled = isValidFee && !isLoading,
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
                        text = "Save Rate Card",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = KaamSurface
                    )
                }
            }
        }
    }
}
