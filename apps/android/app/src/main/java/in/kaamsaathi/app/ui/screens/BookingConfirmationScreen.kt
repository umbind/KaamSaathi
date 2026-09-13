package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.ui.theme.*

data class BookingUiModel(
    val id: String,
    val status: String, // SCHEDULED
    val providerBusinessName: String,
    val providerPhone: String,
    val providerTradeTitle: String,
    val customerAddress: String,
    val customerPhone: String,
    val agreedVisitationFeeRupees: Int,
    val totalAgreedEstimateRupees: Int,
    val scheduledWindow: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookingConfirmationScreen(
    booking: BookingUiModel,
    isHindi: Boolean = true,
    onCallProvider: (phone: String) -> Unit,
    onViewHome: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            TopAppBar(
                title = {
                    Text(
                        text = if (isHindi) "बुकिंग विवरण (Booking Details)" else "Booking Confirmed",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = KaamSurface,
                    titleContentColor = KaamTextPrimary
                )
            )

            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Success Badge Card
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = KaamPrimaryGreen.copy(alpha = 0.12f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.CheckCircle,
                                contentDescription = "Confirmed",
                                tint = KaamPrimaryGreen,
                                modifier = Modifier.size(32.dp)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = if (isHindi) "कारीगर बुक हो गया है!" else "Booking Confirmed!",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 17.sp,
                                    color = KaamPrimaryGreen
                                )
                                Text(
                                    text = "बुकिंग आईडी: #${booking.id.take(8).uppercase()}",
                                    fontSize = 13.sp,
                                    color = KaamTextSecondary
                                )
                            }
                        }
                    }
                }

                // Mutual Contact Revelation: Booked Provider Contact Card
                item {
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
                            Text(
                                text = if (isHindi) "कारीगर संपर्क (Provider Contact)" else "Provider Contact",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = KaamTextPrimary
                            )

                            Text(
                                text = booking.providerBusinessName,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = KaamTextPrimary
                            )

                            Text(
                                text = "सेवा: ${booking.providerTradeTitle}",
                                fontSize = 13.sp,
                                color = KaamTextSecondary
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "फ़ोन: ${booking.providerPhone}",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = KaamTextPrimary
                                )

                                Button(
                                    onClick = { onCallProvider(booking.providerPhone) },
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = KaamSecondaryTeal),
                                    modifier = Modifier.defaultMinSize(minHeight = 44.dp)
                                ) {
                                    Icon(Icons.Default.Phone, contentDescription = "Call", modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(if (isHindi) "कॉल करें" else "Call")
                                }
                            }
                        }
                    }
                }

                // Service Schedule & Address Details
                item {
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
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = if (isHindi) "समय और सेवा स्थल" else "Schedule & Location",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = KaamTextPrimary
                            )

                            Text(
                                text = "समय: ${booking.scheduledWindow}",
                                fontSize = 14.sp,
                                color = KaamTextPrimary
                            )

                            Row(verticalAlignment = Alignment.Top) {
                                Icon(
                                    Icons.Default.LocationOn,
                                    contentDescription = null,
                                    tint = KaamTextSecondary,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = booking.customerAddress,
                                    fontSize = 14.sp,
                                    color = KaamTextSecondary
                                )
                            }
                        }
                    }
                }

                // Agreed Pricing Summary
                item {
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
                            verticalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = if (isHindi) "तय शुल्क विवरण (Agreed Pricing)" else "Agreed Pricing",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = KaamTextPrimary
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    if (isHindi) "निरीक्षण शुल्क (Visit Fee):" else "Visit/Diagnostic Fee:",
                                    fontSize = 13.sp,
                                    color = KaamTextSecondary
                                )
                                Text("₹${booking.agreedVisitationFeeRupees}", fontWeight = FontWeight.SemiBold)
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    if (isHindi) "कुल अनुमानित राशि:" else "Agreed Total Estimate:",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = KaamTextPrimary
                                )
                                Text(
                                    "₹${booking.totalAgreedEstimateRupees}",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = KaamPrimaryGreen
                                )
                            }
                        }
                    }
                }

                // Mandatory Zero-Guarantees Trust Baseline
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = KaamWarningYellow.copy(alpha = 0.12f)
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.Top
                        ) {
                            Icon(
                                Icons.Default.Info,
                                contentDescription = "Trust Policy",
                                tint = KaamWarningYellow,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = if (isHindi)
                                    "मंच आपको स्वतंत्र कारीगरों से जोड़ता है। मंच कारीगर की योग्यता या व्यक्तिगत सुरक्षा की गारंटी नहीं देता है।"
                                else
                                    "The platform connects you with independent service providers. The platform does not guarantee provider competence or personal safety.",
                                fontSize = 12.sp,
                                lineHeight = 16.sp,
                                color = KaamTextPrimary
                            )
                        }
                    }
                }
            }

            Surface(color = KaamSurface, shadowElevation = 8.dp) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Button(
                        onClick = onViewHome,
                        modifier = Modifier
                            .fillMaxWidth()
                            .defaultMinSize(minHeight = 50.dp),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen)
                    ) {
                        Text(
                            text = if (isHindi) "होम पर लौटें (Return Home)" else "Return to Home",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                    }
                }
            }
        }
    }
}
