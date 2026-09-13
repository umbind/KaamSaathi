package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.selection.selectable
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.R
import in.kaamsaathi.app.ui.theme.*

@Composable
fun ProviderVerificationScreen(
    currentBadges: List<Pair<String, String>> = listOf("PHONE_VERIFIED" to "Phone Number Verified"),
    isLoading: Boolean,
    errorMessage: String?,
    onSubmitEvidence: (docType: String, storagePath: String) -> Unit
) {
    var selectedDocType by remember { mutableStateOf("GOVT_PHOTO_ID") }

    val docTypes = listOf(
        Triple("GOVT_PHOTO_ID", "Government Photo ID", "Voter ID, Driving License, or Aadhaar card (Aadhaar is optional)"),
        Triple("TRADE_CERT", "Vocational / Trade Certificate", "ITI diploma, technical training certificate, or apprenticeship credential"),
        Triple("POLICE_CLEARANCE", "Police Clearance Certificate", "Official police character verification or background certificate")
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
                    text = "Verification & Trust Badges",
                    color = KaamTextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Build customer trust by submitting verified documents. Every badge tells customers exactly what was reviewed.",
                    color = KaamTextSecondary,
                    fontSize = 15.sp
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Current Earned Badges
                Text(
                    text = "Your Current Badges:",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = KaamTextPrimary
                )
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    currentBadges.forEach { (_, label) ->
                        SuggestionChip(
                            onClick = {},
                            label = { Text("✓ $label", fontSize = 12.sp, color = KaamSuccess) },
                            colors = SuggestionChipDefaults.suggestionChipColors(
                                containerColor = KaamSuccessBackground
                            ),
                            border = BorderStroke(1.dp, KaamSuccess)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = "Select Document to Submit:",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = KaamTextPrimary
                )

                Spacer(modifier = Modifier.height(8.dp))

                docTypes.forEach { (typeKey, title, desc) ->
                    val isSelected = selectedDocType == typeKey
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .selectable(
                                selected = isSelected,
                                onClick = { selectedDocType = typeKey },
                                role = Role.RadioButton
                            ),
                        shape = MaterialTheme.shapes.medium,
                        colors = CardDefaults.cardColors(containerColor = KaamSurface),
                        border = BorderStroke(
                            width = if (isSelected) 2.dp else 1.dp,
                            color = if (isSelected) KaamPrimary else KaamSurfaceBorder
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = title,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) KaamPrimary else KaamTextPrimary
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = desc,
                                    fontSize = 12.sp,
                                    color = KaamTextSecondary
                                )
                            }
                            RadioButton(
                                selected = isSelected,
                                onClick = null,
                                colors = RadioButtonDefaults.colors(selectedColor = KaamPrimary)
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

                Spacer(modifier = Modifier.height(16.dp))

                // Strict Trust Disclaimer Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = KaamSurface),
                    border = BorderStroke(1.dp, KaamSurfaceBorder)
                ) {
                    Text(
                        text = stringResource(R.string.trust_disclaimer),
                        color = KaamTextSecondary,
                        fontSize = 11.sp,
                        lineHeight = 15.sp,
                        modifier = Modifier.padding(12.dp)
                    )
                }
            }

            Button(
                onClick = {
                    val mockStoragePath = "s3://secure-evidence/${selectedDocType.lowercase()}_upload.enc"
                    onSubmitEvidence(selectedDocType, mockStoragePath)
                },
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
                        text = "Upload & Submit for Verification",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = KaamSurface
                    )
                }
            }
        }
    }
}
