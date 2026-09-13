package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.Star
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
fun ReviewSubmissionScreen(
    providerBusinessName: String,
    categoryName: String,
    isHindi: Boolean = true,
    onBack: () -> Unit,
    onSubmitReview: (rating: Int, comment: String) -> Unit
) {
    var rating by remember { mutableIntStateOf(5) }
    var comment by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            TopAppBar(
                title = {
                    Text(
                        text = if (isHindi) "रेटिंग और समीक्षा दें" else "Rate & Review Service",
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
                // Mandatory Zero Guarantees Disclaimer Banner
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = KaamSurfaceVariant)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Icon(
                            imageVector = Icons.Default.Info,
                            contentDescription = "Zero Guarantees Rule",
                            tint = KaamPrimary,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = if (isHindi)
                                "मंच स्वतंत्र सेवा प्रदाताओं को जोड़ता है। मंच सेवा प्रदाता की व्यक्तिगत क्षमता या व्यक्तिगत सुरक्षा की गारंटी नहीं देता है। सभी समीक्षाएं पारदर्शी हैं।"
                            else
                                "The platform connects you with independent service providers. The platform does not guarantee provider competence or personal safety. Every badge states exactly what was reviewed.",
                            style = MaterialTheme.typography.bodySmall,
                            color = KaamTextSecondary,
                            lineHeight = 18.sp
                        )
                    }
                }

                // Provider summary card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = KaamSurface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = providerBusinessName,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = KaamTextPrimary
                        )
                        Text(
                            text = categoryName,
                            style = MaterialTheme.typography.bodyMedium,
                            color = KaamTextSecondary
                        )
                    }
                }

                // Star Rating Selection (Min 48dp touch targets)
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = KaamSurface)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = if (isHindi) "आपका अनुभव कैसा रहा?" else "How was your experience?",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = KaamTextPrimary
                        )
                        Spacer(modifier = Modifier.height(12.dp))

                        Row(
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            for (i in 1..5) {
                                Box(
                                    modifier = Modifier
                                        .size(48.dp)
                                        .clickable { rating = i },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = if (i <= rating) Icons.Filled.Star else Icons.Outlined.Star,
                                        contentDescription = "$i Star",
                                        tint = if (i <= rating) Color(0xFFF59E0B) else KaamTextSecondary,
                                        modifier = Modifier.size(36.dp)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        val ratingLabel = when (rating) {
                            5 -> if (isHindi) "उत्कृष्ट (Excellent)" else "Excellent"
                            4 -> if (isHindi) "बहुत अच्छा (Very Good)" else "Very Good"
                            3 -> if (isHindi) "सामान्य (Average)" else "Average"
                            2 -> if (isHindi) "खराब (Poor)" else "Poor"
                            else -> if (isHindi) "बहुत खराब (Very Poor)" else "Very Poor"
                        }
                        Text(
                            text = ratingLabel,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium,
                            color = KaamPrimary
                        )
                    }
                }

                // Comment Input Box
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = KaamSurface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = if (isHindi) "अपनी राय लिखें (वैकल्पिक)" else "Write your feedback (Optional)",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = KaamTextPrimary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = comment,
                            onValueChange = {
                                if (it.length <= 500) comment = it
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp),
                            placeholder = {
                                Text(
                                    if (isHindi)
                                        "काम की गुणवत्ता, समय की पाबंदी आदि के बारे में बताएं..."
                                    else
                                        "Describe quality of work, punctuality, pricing transparency..."
                                )
                            },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = KaamPrimary,
                                unfocusedBorderColor = KaamOutline
                            )
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "${comment.length}/500",
                            style = MaterialTheme.typography.bodySmall,
                            color = KaamTextSecondary,
                            modifier = Modifier.align(Alignment.End)
                        )
                    }
                }

                Spacer(modifier = Modifier.weight(1f, fill = false))

                // Submit Button
                Button(
                    onClick = {
                        isSubmitting = true
                        onSubmitReview(rating, comment)
                    },
                    enabled = !isSubmitting,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = KaamPrimary)
                ) {
                    Text(
                        text = if (isHindi) "समीक्षा सबमिट करें" else "Submit Verified Review",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                }
            }
        }
    }
}
