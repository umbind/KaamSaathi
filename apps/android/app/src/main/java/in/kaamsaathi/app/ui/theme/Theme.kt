package in.kaamsaathi.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = KaamPrimary,
    onPrimary = KaamSurface,
    primaryContainer = KaamPrimaryLight,
    secondary = KaamSecondary,
    onSecondary = KaamSurface,
    background = KaamBackground,
    onBackground = KaamTextPrimary,
    surface = KaamSurface,
    onSurface = KaamTextPrimary,
    surfaceVariant = KaamBackground,
    onSurfaceVariant = KaamTextSecondary,
    outline = KaamSurfaceBorder,
    error = KaamError,
    onError = KaamSurface
)

@Composable
fun KaamSaathiTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
