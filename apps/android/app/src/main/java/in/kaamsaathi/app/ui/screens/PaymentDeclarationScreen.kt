package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PaymentDeclarationScreen(
    isProvider: Boolean,
    bookingTotalRupees: Int,
    isHindi: Boolean = true,
    declaredMethod: String? = null,
    declaredAmountRupees: Int? = null,
    declaredReference: String? = null,
    onBack: () -> Unit,
    onDeclarePayment: (method: String, amountPaise: Int, reference: String) -> Unit,
    onConfirmPayment: (confirmed: Boolean) -> Unit
) {
    var selectedMethod by remember { mutableStateOf("UPI") }
    var amountRupees by remember { mutableStateOf(bookingTotalRupees.toString()) }
    var referenceId by remember { mutableStateOf("") }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            TopAppBar(
                title = {
                    Text(
                        text = if (isProvider)
                            (if (isHindi) "भुगतान संग्रह घोषणा" else "Declare Payment Collection")
                        else
                            (if (isHindi) "भुगतान सत्यापन" else "Confirm Payment"),
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

            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                if (isProvider) {
                    // Provider Payment Collection Declaration
                    Text(
                        text = if (isHindi)
                            "ग्राहक से प्राप्त भुगतान की घोषणा करें:"
                        else
                            "Declare payment collected from customer:",
                        fontSize = 15.sp,
                        color = KaamTextPrimary
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        FilterChip(
                            selected = selectedMethod == "UPI",
                            onClick = { selectedMethod = "UPI" },
                            label = { Text("UPI QR (ऑनलाइन)", fontWeight = FontWeight.SemiBold) },
                            modifier = Modifier.weight(1f).defaultMinSize(minHeight = 48.dp)
                        )
                        FilterChip(
                            selected = selectedMethod == "CASH",
                            onClick = { selectedMethod = "CASH" },
                            label = { Text("Cash (नकद)", fontWeight = FontWeight.SemiBold) },
                            modifier = Modifier.weight(1f).defaultMinSize(minHeight = 48.dp)
                        )
                    }

                    OutlinedTextField(
                        value = amountRupees,
                        onValueChange = { amountRupees = it },
                        label = { Text(if (isHindi) "प्राप्त राशि (₹)" else "Collected Amount (₹)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 56.dp),
                        shape = RoundedCornerShape(10.dp)
                    )

                    OutlinedTextField(
                        value = referenceId,
                        onValueChange = { referenceId = it },
                        label = {
                            Text(
                                if (selectedMethod == "UPI")
                                    (if (isHindi) "यूपीआई संदर्भ / UTR नंबर" else "UPI Transaction / UTR ID")
                                else
                                    (if (isHindi) "रसीद टिप्पणी (वैकल्पिक)" else "Receipt Note (Optional)")
                            )
                        },
                        modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 56.dp),
                        shape = RoundedCornerShape(10.dp)
                    )

                    Spacer(modifier = Modifier.weight(1f))

                    Button(
                        onClick = {
                            val amt = (amountRupees.toIntOrNull() ?: 0) * 100
                            if (amt > 0) {
                                onDeclarePayment(selectedMethod, amt, referenceId)
                            }
                        },
                        modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 50.dp),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen)
                    ) {
                        Text(
                            text = if (isHindi) "भुगतान दर्ज करें (Submit Declaration)" else "Submit Payment Declaration",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                    }
                } else {
                    // Customer Payment Verification
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
                            Text(
                                text = if (isHindi) "कारीगर द्वारा दर्ज भुगतान विवरण:" else "Declared Payment Details:",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = KaamTextPrimary
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(if (isHindi) "भुगतान माध्यम:" else "Payment Method:", color = KaamTextSecondary)
                                Text(declaredMethod ?: "UPI", fontWeight = FontWeight.Bold)
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(if (isHindi) "राशि (Amount):" else "Amount Paid:", color = KaamTextSecondary)
                                Text("₹${declaredAmountRupees ?: bookingTotalRupees}", fontWeight = FontWeight.Bold, color = KaamPrimaryGreen)
                            }

                            if (!declaredReference.isNullOrBlank()) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(if (isHindi) "संदर्भ संख्या:" else "Reference ID:", color = KaamTextSecondary)
                                    Text(declaredReference, fontWeight = FontWeight.SemiBold)
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.weight(1f))

                    Button(
                        onClick = { onConfirmPayment(true) },
                        modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 50.dp),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = KaamPrimaryGreen)
                    ) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (isHindi) "हाँ, भुगतान पूर्ण हो गया है (Confirm)" else "Confirm Payment Completed",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        )
                    }

                    OutlinedButton(
                        onClick = { onConfirmPayment(false) },
                        modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 48.dp),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(
                            text = if (isHindi) "विवाद दर्ज करें (Dispute)" else "Dispute Payment",
                            color = KaamErrorRed
                        )
                    }
                }
            }
        }
    }
}
