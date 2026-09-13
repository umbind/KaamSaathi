package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.ui.theme.*

data class LeadItemUiModel(
    val id: String,
    val requestId: String,
    val categoryName: String,
    val description: String,
    val localityName: String,
    val districtId: String,
    val pinCode: String,
    val preferredSchedule: String,
    val expiresInMinutes: Int = 120
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProviderInboxScreen(
    leads: List<LeadItemUiModel>,
    isHindi: Boolean = true,
    isLoading: Boolean = false,
    onRefresh: () -> Unit,
    onSendQuote: (leadId: String) -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            TopAppBar(
                title = {
                    Text(
                        text = if (isHindi) "उपलब्ध काम (New Leads)" else "Available Leads",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                },
                actions = {
                    IconButton(onClick = onRefresh) {
                        Icon(Icons.Default.Notifications, contentDescription = "Refresh")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = KaamSurface,
                    titleContentColor = KaamTextPrimary
                )
            )

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Phased Privacy Notice
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = KaamSecondaryTeal.copy(alpha = 0.12f)
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.Info,
                                contentDescription = "Privacy Policy",
                                tint = KaamSecondaryTeal,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = if (isHindi)
                                    "गोपनीयता नीति: ग्राहक का फ़ोन नंबर और सटीक पता कोटेशन स्वीकार होने के बाद ही साझा किया जाएगा।"
                                else
                                    "Privacy Policy: Customer contact number & exact address are revealed only after your quote is accepted.",
                                fontSize = 12.sp,
                                lineHeight = 16.sp,
                                color = KaamTextPrimary
                            )
                        }
                    }
                }

                if (leads.isEmpty()) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 48.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (isHindi) "वर्तमान में आपके क्षेत्र में कोई नया काम उपलब्ध नहीं है।"
                                else "No new leads in your service coverage area right now.",
                                color = KaamTextSecondary,
                                fontSize = 15.sp
                            )
                        }
                    }
                } else {
                    items(leads) { lead ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = KaamSurface),
                            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Badge(
                                        containerColor = KaamPrimaryGreen.copy(alpha = 0.15f),
                                        contentColor = KaamPrimaryGreen
                                    ) {
                                        Text(
                                            lead.categoryName,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }

                                    Text(
                                        text = if (isHindi) "शेष समय: ${lead.expiresInMinutes} मिनट" else "Expires in ${lead.expiresInMinutes}m",
                                        fontSize = 12.sp,
                                        color = KaamWarningYellow,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                }

                                Text(
                                    text = lead.description,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = KaamTextPrimary
                                )

                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        Icons.Default.LocationOn,
                                        contentDescription = "Location",
                                        tint = KaamTextSecondary,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "${lead.localityName}, ${lead.districtId} (${lead.pinCode})",
                                        fontSize = 13.sp,
                                        color = KaamTextSecondary
                                    )
                                }

                                Text(
                                    text = if (isHindi) "समय: ${lead.preferredSchedule}" else "Schedule: ${lead.preferredSchedule}",
                                    fontSize = 13.sp,
                                    color = KaamTextSecondary
                                )

                                Divider(color = KaamDivider, thickness = 1.dp)

                                Button(
                                    onClick = { onSendQuote(lead.id) },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .defaultMinSize(minHeight = 48.dp),
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen)
                                ) {
                                    Icon(
                                        Icons.Default.Send,
                                        contentDescription = "Quote",
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = if (isHindi) "कोटेशन भेजें (Send Quote)" else "Send Quote",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
