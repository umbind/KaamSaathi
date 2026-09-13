package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.ui.theme.*

data class QuoteItemUiModel(
    val id: String,
    val providerBusinessName: String,
    val providerTradeTitle: String,
    val ratingAvg: Double,
    val badges: List<String>,
    val visitationFeeRupees: Int,
    val laborEstimateRupees: Int,
    val partsEstimateRupees: Int,
    val totalEstimateRupees: Int,
    val scopeNotes: String,
    val validUntil: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerQuotesComparisonScreen(
    quotes: List<QuoteItemUiModel>,
    isHindi: Boolean = true,
    isLoading: Boolean = false,
    errorMessage: String? = null,
    onBack: () -> Unit,
    onAcceptQuote: (quoteId: String, consentContactReveal: Boolean) -> Unit
) {
    var selectedQuoteForModal by remember { mutableStateOf<QuoteItemUiModel?>(null) }
    var consentChecked by remember { mutableStateOf(false) }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            TopAppBar(
                title = {
                    Text(
                        text = if (isHindi) "प्राप्त कोटेशन (Quotes)" else "Review Quotes",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
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
                // Header Information
                item {
                    Text(
                        text = if (isHindi)
                            "कारीगरों के अनुमानित शुल्क और समीक्षाओं की तुलना करें।"
                        else
                            "Compare itemized estimates and verified badges from available providers.",
                        fontSize = 14.sp,
                        color = KaamTextSecondary
                    )
                }

                if (quotes.isEmpty()) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 48.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (isHindi) "कारीगरों से कोटेशन की प्रतीक्षा की जा रही है..."
                                else "Waiting for providers to submit quotes...",
                                color = KaamTextSecondary,
                                fontSize = 15.sp
                            )
                        }
                    }
                } else {
                    items(quotes) { quote ->
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
                                verticalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                // Provider Header
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Column {
                                        Text(
                                            text = quote.providerBusinessName,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 17.sp,
                                            color = KaamTextPrimary
                                        )
                                        Text(
                                            text = quote.providerTradeTitle,
                                            fontSize = 13.sp,
                                            color = KaamTextSecondary
                                        )
                                    }

                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            Icons.Default.Star,
                                            contentDescription = "Rating",
                                            tint = KaamWarningYellow,
                                            modifier = Modifier.size(18.dp)
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = "${quote.ratingAvg}",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp
                                        )
                                    }
                                }

                                // Badges
                                if (quote.badges.isNotEmpty()) {
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        quote.badges.forEach { badge ->
                                            AssistChip(
                                                onClick = {},
                                                label = { Text(badge, fontSize = 11.sp) },
                                                leadingIcon = {
                                                    Icon(
                                                        Icons.Default.CheckCircle,
                                                        contentDescription = null,
                                                        tint = KaamPrimaryGreen,
                                                        modifier = Modifier.size(14.dp)
                                                    )
                                                },
                                                modifier = Modifier.height(32.dp)
                                            )
                                        }
                                    }
                                }

                                Divider(color = KaamDivider, thickness = 1.dp)

                                // Itemized Cost Breakdown
                                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            if (isHindi) "विज़िट व निरीक्षण शुल्क:" else "Diagnostic/Visit Fee:",
                                            fontSize = 13.sp,
                                            color = KaamTextSecondary
                                        )
                                        Text(
                                            "₹${quote.visitationFeeRupees}",
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                    }

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            if (isHindi) "अनुमानित मजदूरी (Labor):" else "Estimated Labor:",
                                            fontSize = 13.sp,
                                            color = KaamTextSecondary
                                        )
                                        Text(
                                            "₹${quote.laborEstimateRupees}",
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                    }

                                    if (quote.partsEstimateRupees > 0) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(
                                                if (isHindi) "अनुमानित सामग्री (Parts):" else "Estimated Parts:",
                                                fontSize = 13.sp,
                                                color = KaamTextSecondary
                                            )
                                            Text(
                                                "₹${quote.partsEstimateRupees}",
                                                fontSize = 13.sp,
                                                fontWeight = FontWeight.SemiBold
                                            )
                                        }
                                    }

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            if (isHindi) "कुल अनुमान (Total Estimate):" else "Total Estimate:",
                                            fontSize = 15.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = KaamTextPrimary
                                        )
                                        Text(
                                            "₹${quote.totalEstimateRupees}",
                                            fontSize = 16.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = KaamPrimaryGreen
                                        )
                                    }
                                }

                                if (quote.scopeNotes.isNotBlank()) {
                                    Text(
                                        text = "टिप्पणी: ${quote.scopeNotes}",
                                        fontSize = 13.sp,
                                        color = KaamTextSecondary
                                    )
                                }

                                Button(
                                    onClick = {
                                        selectedQuoteForModal = quote
                                        consentChecked = false
                                    },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .defaultMinSize(minHeight = 48.dp),
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen)
                                ) {
                                    Text(
                                        text = if (isHindi) "कोटेशन स्वीकार करें (Accept Quote)" else "Accept Quote",
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

        // Quote Acceptance & Contact Reveal Modal
        selectedQuoteForModal?.let { modalQuote ->
            AlertDialog(
                onDismissRequest = { selectedQuoteForModal = null },
                icon = {
                    Icon(
                        Icons.Default.Lock,
                        contentDescription = "Consent",
                        tint = KaamPrimaryGreen,
                        modifier = Modifier.size(32.dp)
                    )
                },
                title = {
                    Text(
                        text = if (isHindi) "बुकिंग और संपर्क प्रकटीकरण सहमति" else "Booking & Contact Reveal Consent",
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp
                    )
                },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text(
                            text = if (isHindi)
                                "आप '${modalQuote.providerBusinessName}' का ₹${modalQuote.totalEstimateRupees} का कोटेशन स्वीकार कर रहे हैं।"
                            else
                                "You are accepting the quote from '${modalQuote.providerBusinessName}' for ₹${modalQuote.totalEstimateRupees}.",
                            fontSize = 14.sp,
                            color = KaamTextPrimary
                        )

                        Text(
                            text = if (isHindi)
                                "मंच आपको स्वतंत्र कारीगरों से जोड़ता है। मंच कारीगर की योग्यता या व्यक्तिगत सुरक्षा की गारंटी नहीं देता है।"
                            else
                                "The platform connects you with independent service providers. The platform does not guarantee provider competence or personal safety.",
                            fontSize = 12.sp,
                            color = KaamTextSecondary
                        )

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Checkbox(
                                checked = consentChecked,
                                onCheckedChange = { consentChecked = it },
                                modifier = Modifier.defaultMinSize(minHeight = 48.dp, minWidth = 48.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (isHindi)
                                    "मैं पुष्टि करता/करती हूँ कि मेरा फ़ोन नंबर और पूरा पता इस कारीगर के साथ साझा किया जाए।"
                                else
                                    "I consent to reveal my verified phone number and service address to this provider.",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (consentChecked) {
                                val qId = modalQuote.id
                                selectedQuoteForModal = null
                                onAcceptQuote(qId, true)
                            }
                        },
                        enabled = consentChecked && !isLoading,
                        colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen)
                    ) {
                        Text(if (isHindi) "स्वीकार करें व बुक करें" else "Confirm Booking")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { selectedQuoteForModal = null }) {
                        Text(if (isHindi) "रद्द करें" else "Cancel")
                    }
                }
            )
        }
    }
}
