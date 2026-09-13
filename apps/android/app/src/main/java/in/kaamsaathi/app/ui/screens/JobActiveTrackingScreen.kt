package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Phone
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
fun JobActiveTrackingScreen(
    isProvider: Boolean,
    currentStatus: String, // SCHEDULED, EN_ROUTE, ARRIVED, IN_PROGRESS, COMPLETED
    customerName: String,
    customerPhone: String,
    customerAddress: String,
    providerName: String,
    providerPhone: String,
    agreedTotalRupees: Int,
    isHindi: Boolean = true,
    pendingChangeOrder: Pair<String, Int>? = null, // description to total paise
    onAdvanceStatus: (nextStatus: String) -> Unit,
    onRequestChangeOrder: (description: String, laborPaise: Int, partsPaise: Int) -> Unit,
    onReviewChangeOrder: (approve: Boolean) -> Unit,
    onCollectPayment: () -> Unit
) {
    var showChangeOrderDialog by remember { mutableStateOf(false) }
    var coDescription by remember { mutableStateOf("") }
    var coLaborRupees by remember { mutableStateOf("") }
    var coPartsRupees by remember { mutableStateOf("") }

    val stages = listOf(
        "SCHEDULED" to (if (isHindi) "समय तय" else "Scheduled"),
        "EN_ROUTE" to (if (isHindi) "रवाना हुए" else "En Route"),
        "ARRIVED" to (if (isHindi) "पहुँच गए" else "Arrived"),
        "IN_PROGRESS" to (if (isHindi) "कार्य जारी" else "In Progress"),
        "COMPLETED" to (if (isHindi) "पूर्ण" else "Completed")
    )

    val currentStageIndex = stages.indexOfFirst { it.first == currentStatus }.coerceAtLeast(0)

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            TopAppBar(
                title = {
                    Text(
                        text = if (isHindi) "कार्य प्रगति (Job Status)" else "Live Job Tracking",
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
                // Stepper Progress Bar
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
                                .padding(16.dp)
                        ) {
                            Text(
                                text = if (isHindi) "कार्य स्थिति (Progress)" else "Job Progression",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = KaamTextPrimary
                            )
                            Spacer(modifier = Modifier.height(16.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                stages.forEachIndexed { index, stage ->
                                    val isDone = index <= currentStageIndex
                                    val isCurrent = index == currentStageIndex

                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(32.dp)
                                                .background(
                                                    color = if (isDone) KaamPrimaryGreen else KaamDivider,
                                                    shape = CircleShape
                                                ),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            if (isDone) {
                                                Icon(
                                                    Icons.Default.Check,
                                                    contentDescription = null,
                                                    tint = KaamSurface,
                                                    modifier = Modifier.size(18.dp)
                                                )
                                            } else {
                                                Text(
                                                    "${index + 1}",
                                                    color = KaamTextSecondary,
                                                    fontSize = 12.sp,
                                                    fontWeight = FontWeight.Bold
                                                )
                                            }
                                        }

                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = stage.second,
                                            fontSize = 11.sp,
                                            fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Normal,
                                            color = if (isCurrent) KaamPrimaryGreen else KaamTextSecondary,
                                            maxLines = 1
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                // Counterpart Contact Card
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
                                text = if (isProvider)
                                    (if (isHindi) "ग्राहक विवरण (Customer Details)" else "Customer Details")
                                else
                                    (if (isHindi) "कारीगर विवरण (Provider Details)" else "Provider Details"),
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = KaamTextPrimary
                            )

                            Text(
                                text = if (isProvider) customerName else providerName,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.SemiBold
                            )

                            Text(
                                text = "फ़ोन: ${if (isProvider) customerPhone else providerPhone}",
                                fontSize = 14.sp,
                                color = KaamTextPrimary
                            )

                            if (isProvider) {
                                Row(verticalAlignment = Alignment.Top) {
                                    Icon(Icons.Default.LocationOn, contentDescription = null, tint = KaamTextSecondary, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(customerAddress, fontSize = 13.sp, color = KaamTextSecondary)
                                }
                            }
                        }
                    }
                }

                // Pending Change Order Alert
                pendingChangeOrder?.let { (coDesc, coPaise) ->
                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = KaamWarningYellow.copy(alpha = 0.15f))
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Text(
                                    text = if (isHindi) "अतिरिक्त कार्य प्रस्ताव (Change Order)" else "Change Order Pending Approval",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    color = KaamTextPrimary
                                )
                                Text(
                                    text = "$coDesc (+₹${coPaise / 100})",
                                    fontSize = 14.sp,
                                    color = KaamTextPrimary
                                )

                                if (!isProvider) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                                    ) {
                                        Button(
                                            onClick = { onReviewChangeOrder(true) },
                                            colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen),
                                            modifier = Modifier.weight(1f).defaultMinSize(minHeight = 44.dp)
                                        ) {
                                            Text(if (isHindi) "स्वीकार करें" else "Approve")
                                        }

                                        OutlinedButton(
                                            onClick = { onReviewChangeOrder(false) },
                                            modifier = Modifier.weight(1f).defaultMinSize(minHeight = 44.dp)
                                        ) {
                                            Text(if (isHindi) "अस्वीकार करें" else "Reject")
                                        }
                                    }
                                } else {
                                    Text(
                                        text = if (isHindi) "ग्राहक की स्वीकृति की प्रतीक्षा है..." else "Waiting for customer approval...",
                                        fontSize = 12.sp,
                                        color = KaamTextSecondary
                                    )
                                }
                            }
                        }
                    }
                }

                // Agreed Total Pricing
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = KaamSurface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = if (isHindi) "तय कुल राशि (Agreed Total):" else "Agreed Total:",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp
                            )
                            Text(
                                text = "₹$agreedTotalRupees",
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = KaamPrimaryGreen
                            )
                        }
                    }
                }
            }

            // Provider Bottom Controls
            if (isProvider && currentStatus != "COMPLETED") {
                Surface(color = KaamSurface, shadowElevation = 8.dp) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        when (currentStatus) {
                            "SCHEDULED" -> {
                                Button(
                                    onClick = { onAdvanceStatus("EN_ROUTE") },
                                    modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 50.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen)
                                ) {
                                    Text(if (isHindi) "मैं रवाना हो रहा हूँ (Mark En Route)" else "I am En Route", fontWeight = FontWeight.Bold)
                                }
                            }
                            "EN_ROUTE" -> {
                                Button(
                                    onClick = { onAdvanceStatus("ARRIVED") },
                                    modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 50.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen)
                                ) {
                                    Text(if (isHindi) "मैं पहुँच गया हूँ (Mark Arrived)" else "I Have Arrived", fontWeight = FontWeight.Bold)
                                }
                            }
                            "ARRIVED" -> {
                                Button(
                                    onClick = { onAdvanceStatus("IN_PROGRESS") },
                                    modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 50.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen)
                                ) {
                                    Text(if (isHindi) "काम शुरू करें (Start Work)" else "Start Work", fontWeight = FontWeight.Bold)
                                }
                            }
                            "IN_PROGRESS" -> {
                                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                    OutlinedButton(
                                        onClick = { showChangeOrderDialog = true },
                                        modifier = Modifier.weight(1f).defaultMinSize(minHeight = 48.dp)
                                    ) {
                                        Text(if (isHindi) "+ अतिरिक्त कार्य" else "+ Change Order", fontSize = 13.sp)
                                    }

                                    Button(
                                        onClick = onCollectPayment,
                                        modifier = Modifier.weight(1f).defaultMinSize(minHeight = 48.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen)
                                    ) {
                                        Text(if (isHindi) "काम पूर्ण / भुगतान" else "Complete & Pay", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Change Order Dialog
        if (showChangeOrderDialog) {
            AlertDialog(
                onDismissRequest = { showChangeOrderDialog = false },
                title = { Text(if (isHindi) "अतिरिक्त कार्य जोड़ें (Change Order)" else "Propose Change Order") },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedTextField(
                            value = coDescription,
                            onValueChange = { coDescription = it },
                            label = { Text(if (isHindi) "अतिरिक्त कार्य विवरण" else "Description") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = coLaborRupees,
                            onValueChange = { coLaborRupees = it },
                            label = { Text(if (isHindi) "अतिरिक्त मजदूरी (₹)" else "Extra Labor (₹)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = coPartsRupees,
                            onValueChange = { coPartsRupees = it },
                            label = { Text(if (isHindi) "अतिरिक्त सामग्री (₹)" else "Extra Parts (₹)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val labor = (coLaborRupees.toIntOrNull() ?: 0) * 100
                            val parts = (coPartsRupees.toIntOrNull() ?: 0) * 100
                            if (coDescription.isNotBlank() && (labor + parts) > 0) {
                                onRequestChangeOrder(coDescription, labor, parts)
                                showChangeOrderDialog = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen)
                    ) {
                        Text(if (isHindi) "प्रस्ताव भेजें" else "Submit")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showChangeOrderDialog = false }) {
                        Text(if (isHindi) "रद्द करें" else "Cancel")
                    }
                }
            )
        }
    }
}
