import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const source = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/en/ai-hairstyle-changer.json'), 'utf8'),
)

const specs = {
  de: {
    meta: [
      'Kostenloser AI Hairstyle Changer online | Ohne Anmeldung | Toolaze',
      'Teste den Toolaze AI Hairstyle Changer kostenlos online, ohne Anmeldung und ohne Wasserzeichen. Lade ein Foto hoch, wähle eine Frisur und passe den Prompt an.',
    ],
    displayName: 'AI Frisurenwechsler',
    presetTitle: 'Frisur auswählen',
    styles: ['Stufiger Bob', 'Lange Stufen', 'Slick Back', 'Beach Waves', 'Seitliches Volumen', 'Taper Fade', 'Strukturierter Kurzschnitt', 'Lockiger Kurzschnitt', 'Buzz Cut', 'Pixie Hochsteckfrisur', 'Lockiger Bob'],
    sampleTitle: 'Foto und Frisurenidee als Vorschau',
    hero: [
      'Kostenloser AI <span class="text-gradient">Frisurenwechsler</span> online',
      'Lade ein klares Porträt hoch, wähle eine Frisur und teste einen neuen Look mit bearbeitbarem Prompt, ohne Anmeldung und ohne Wasserzeichen.',
    ],
    intro: [
      'Was ist ein AI Frisurenwechsler?',
      'Haarschnitt- und Stylingideen mit einem Foto testen',
      'Ein AI Frisurenwechsler bearbeitet das sichtbare Haar in einem Porträt. So kannst du Schnitt, Länge, Textur oder Styling vergleichen. Toolaze kombiniert visuelle Frisurvorlagen mit einem bearbeitbaren Prompt. Das Ergebnis ist eine kreative Vorschau und keine Garantie für einen echten Haarschnitt.',
    ],
    howTitle: 'So änderst du deine Frisur mit AI',
    steps: [
      ['Ein klares Porträt hochladen', 'Nutze ein frontales oder leicht seitliches Foto, auf dem Kopf, Haarform und Haaransatz gut sichtbar sind.'],
      ['Eine Frisur auswählen', 'Wähle eine visuelle Vorlage wie Bob, Beach Waves, Taper Fade, lockigen Kurzschnitt oder Buzz Cut.'],
      ['Prompt anpassen und generieren', 'Ergänze Länge, Pony, Volumen, Locken oder unveränderte Bildbereiche und verfeinere anschließend die Vorschau.'],
    ],
    ideas: ['Beliebte Frisuren zum Ausprobieren', 'Starte mit einer visuellen Vorlage und passe danach Länge, Textur, Volumen und Finish im Prompt an.', 'Nach der Auswahl kannst du Länge, Textur und Volumen im Prompt weiter anpassen.'],
    photo: [
      'Fototipps für bessere Frisurvorschauen',
      'Ein gutes Referenzfoto zeigt Gesicht, Haaransatz, Kopfform, Licht und Hintergrund möglichst deutlich.',
      [
        ['Kopf und Haare vollständig zeigen', 'Vermeide Bilder, bei denen Oberkopf oder Haare abgeschnitten, verdeckt oder von Händen bedeckt sind.'],
        ['Gleichmäßiges Frontlicht nutzen', 'Starke Schatten und Gegenlicht erschweren die Erkennung von Haaransatz und Textur.'],
        ['Einen einfachen Winkel wählen', 'Frontale und leichte Dreiviertel-Porträts funktionieren besser als extreme Seitenansichten.'],
        ['Gesicht frei halten', 'Vermeide starke Bewegungsunschärfe, Sonnenbrillen und Haare, die das Gesicht großflächig verdecken.'],
      ],
    ],
    compare: [
      'AI Frisurvorschau im Vergleich zum echten Haarschnitt',
      'Nutze das AI Ergebnis als visuelle Richtung. Ein Profi beurteilt weiterhin Haarstruktur, Dichte, Wuchs, Pflegeaufwand und technische Umsetzbarkeit.',
      ['Frage', 'Die AI Vorschau hilft bei', 'Ein Profi entscheidet'],
      [
        ['Passt diese Länge optisch?', 'Kurze, mittlere und lange Proportionen vergleichen.', 'Welche Länge real entfernt werden kann, ohne die gewünschte Form zu verlieren.'],
        ['Wie könnten Pony oder Fransen wirken?', 'Gesichtsrahmen und Stylingrichtungen testen.', 'Wie der Pony zu Haaransatz, Wirbeln, Dichte und Pflege geschnitten wird.'],
        ['Kann ich eine andere Textur testen?', 'Wellen, Locken, glattes Styling oder mehr Volumen visualisieren.', 'Welche Stylingmethoden für das natürliche Haar realistisch sind.'],
        ['Ist die Vorschau exakt?', 'Schnell ein Konzept zum Vergleichen oder Besprechen erstellen.', 'Realistische Erwartungen nach Beratung und Analyse der Haarqualität setzen.'],
      ],
    ],
    scenesTitle: 'Einsatzmöglichkeiten für den AI Frisurenwechsler',
    scenes: [
      ['Ideen vor dem Salontermin', 'Vergleiche mehrere Richtungen, bevor du Schnitt oder Styling mit einem Profi besprichst.'],
      ['Profilfoto auffrischen', 'Teste neue Looks für Avatare, Creator-Profile, Dating-Profile oder Personal Branding.'],
      ['Männerhaarschnitte testen', 'Vergleiche Taper Fade, strukturierte Kurzschnitte, Locken, Slick Back und Buzz Cut.'],
      ['Kostüm- und Figurenplanung', 'Probiere Frisuren für Cosplay, Themenporträts, Auftritte und Figurenkonzepte aus.'],
      ['Kreative Social-Inhalte', 'Erstelle Stilvarianten für Posts, Moodboards, Thumbnails und Vorher-Ideen.'],
    ],
    featuresTitle: 'Funktionen des AI Frisurenwechslers',
    features: [
      ['Ein-Foto-Workflow', 'Bearbeite ein hochgeladenes Porträt, statt eine neue Person zu erzeugen.'],
      ['Visuelle Frisurvorlagen', 'Starte mit klaren Bildkarten, ohne jeden Stilnamen selbst kennen zu müssen.'],
      ['Bearbeitbarer Prompt', 'Passe Länge, Stufen, Pony, Locken, Volumen, Textur und unveränderte Bereiche an.'],
      ['Styles für verschiedene Looks', 'Teste lange, kurze, lockige, glatte, feminine, maskuline und pflegeleichte Richtungen.'],
      ['Generieren und verfeinern', 'Ändere den Prompt, wenn Form, Länge, Textur oder Realismus noch nicht passen.'],
      ['Kostenlos online nutzen', 'Teste den Standard-Workflow ohne Anmeldung und ohne Wasserzeichen.'],
    ],
    testimonials: [
      'Das sagen Nutzer über den AI Frisurenwechsler',
      'Toolaze wird als Ideenhilfe und visuelle Referenz genutzt, nicht als Garantie für ein exaktes Salonergebnis.',
      ['Planung eines kürzeren Schnitts', 'Männerhaarschnitte vergleichen', 'Konzepte für Creator-Porträts'],
      [
        'Ich konnte mir einen Bob vorher kaum vorstellen. Die Vorlagen halfen mir, Länge und Form zu vergleichen. Kleine Details waren nicht perfekt, aber als Referenz für meinen Salontermin war das Ergebnis sehr nützlich.',
        'Mit einem frontalen Foto habe ich Taper Fade, strukturierten Kurzschnitt und Buzz Cut verglichen. Im Prompt konnte ich weniger Höhe und sauberere Seiten anfordern, bevor ich die Richtung mit meinem Barber besprochen habe.',
        'Für ein neues Profilbild wollte ich einen glatten Look und einen lockigen Bob testen. Die Karten waren schnell zu scannen und die Ergebnisse funktionierten gut als Moodboard für die weitere Planung.',
      ],
    ],
    faqTitle: 'FAQ zum AI Frisurenwechsler',
    faq: [
      ['Wie funktioniert ein AI Frisurenwechsler?', 'Er nutzt dein Porträt als Referenz und bearbeitet das sichtbare Haar nach Vorlage und Prompt. Gesicht, Kleidung, Pose und Hintergrund können als unverändert beschrieben werden.'],
      ['Welches Foto eignet sich am besten?', 'Nutze ein klares frontales oder leicht seitliches Porträt mit sichtbarem Kopf, gleichmäßigem Licht und wenig Verdeckung.'],
      ['Kann ich Frisuren für Frauen und Männer testen?', 'Ja. Die Vorlagen enthalten lange Stufen, Wellen, Bobs, Kurzschnitte, Fades, Locken und Buzz Cuts.'],
      ['Kann ich eine Vorlage anpassen?', 'Ja. Bearbeite nach der Auswahl Länge, Pony, Scheitel, Locken, Volumen und Textur direkt im Prompt.'],
      ['Bleibt mein Gesicht unverändert?', 'Der Prompt fordert Identitätsschutz an, Ergebnisse können aber variieren. Prüfe die Vorschau und verfeinere den Prompt bei Bedarf.'],
      ['Ist die Vorschau eine exakte Haarschnittsimulation?', 'Nein. Sie ist ein visuelles Konzept. Das echte Ergebnis hängt von Struktur, Dichte, Wuchs, Ausgangslänge und Technik ab.'],
      ['Ist Toolaze kostenlos und ohne Anmeldung nutzbar?', 'Ja. Der Standard-Workflow ist kostenlos, ohne Anmeldung und ohne Wasserzeichen verfügbar.'],
      ['Kann ich das Ergebnis herunterladen?', 'Nach der Generierung kannst du die verfügbaren Steuerelemente zum Speichern oder Herunterladen verwenden.'],
      ['Kann ich die Vorschau im Salon zeigen?', 'Ja. Nutze sie als allgemeine Richtung und kläre mit einem Profi, was für dein Haar realistisch ist.'],
    ],
    related: ['Ähnliche AI Tools', ['Eine andere Haarfarbe mit einem Porträt testen.', 'Ein hochgeladenes Bild mit einem eigenen Text-Prompt bearbeiten.', 'Alte, verblasste oder beschädigte Porträts online verbessern.']],
  },
  es: {
    meta: [
      'Cambiador de peinado con IA gratis | Sin registro | Toolaze',
      'Prueba el cambiador de peinado con IA de Toolaze gratis, sin registro y sin marca de agua. Sube una foto, elige un estilo y ajusta el prompt.',
    ],
    displayName: 'Cambiador de peinado con IA',
    presetTitle: 'Elige un peinado',
    styles: ['Bob en capas', 'Capas largas', 'Peinado hacia atrás', 'Ondas playeras', 'Volumen lateral', 'Degradado taper', 'Corte texturizado', 'Corte rizado', 'Rapado', 'Recogido pixie', 'Bob rizado'],
    sampleTitle: 'Vista previa de foto e idea de peinado',
    hero: [
      'Cambiador de <span class="text-gradient">peinado con IA</span> gratis',
      'Sube un retrato claro, elige un peinado y prueba un nuevo look con un prompt editable, sin registro y sin marca de agua.',
    ],
    intro: [
      '¿Qué es un cambiador de peinado con IA?',
      'Prueba ideas de corte y peinado con una foto',
      'Un cambiador de peinado con IA edita el cabello visible de un retrato para explorar otro corte, largo, textura o acabado. Toolaze combina presets visuales con un prompt editable. El resultado sirve como concepto visual y no garantiza cómo quedará un corte real.',
    ],
    howTitle: 'Cómo cambiar tu peinado con IA',
    steps: [
      ['Sube un retrato claro', 'Usa una foto frontal o en tres cuartos donde se vean toda la cabeza, la forma del cabello y la línea de nacimiento.'],
      ['Elige un peinado', 'Selecciona un preset visual como bob, ondas, degradado taper, corte rizado o rapado.'],
      ['Edita el prompt y genera', 'Añade largo, flequillo, volumen, rizos o elementos que deben conservarse y vuelve a generar si hace falta.'],
    ],
    ideas: ['Peinados populares para probar', 'Empieza con un preset visual y ajusta en el prompt el largo, la textura, el volumen y el acabado.', 'Después de elegirlo, puedes ajustar largo, textura y volumen en el prompt.'],
    photo: [
      'Consejos de foto para mejores resultados',
      'Una buena referencia muestra con claridad el rostro, la línea del cabello, la forma de la cabeza, la luz y el fondo.',
      [
        ['Muestra toda la cabeza y el cabello', 'Evita fotos con la parte superior cortada, sombreros o manos que oculten gran parte del cabello.'],
        ['Usa luz frontal uniforme', 'Las sombras fuertes y el contraluz dificultan leer la línea del cabello y la textura.'],
        ['Elige un ángulo sencillo', 'Los retratos frontales o en tres cuartos funcionan mejor que los perfiles extremos.'],
        ['Mantén el rostro despejado', 'Evita desenfoque fuerte, gafas oscuras y mechones que cubran la mayor parte del rostro.'],
      ],
    ],
    compare: [
      'Vista previa con IA frente a un corte real',
      'Usa el resultado como orientación visual. Un profesional debe valorar textura, densidad, crecimiento, mantenimiento y viabilidad técnica.',
      ['Pregunta', 'La vista con IA ayuda a', 'Un profesional decide'],
      [
        ['¿Me favorece este largo?', 'Comparar proporciones cortas, medias y largas.', 'Cuánto largo puede retirarse manteniendo la forma deseada.'],
        ['¿Cómo se vería un flequillo?', 'Explorar opciones que enmarcan el rostro.', 'Cómo cortar según nacimiento, remolinos, densidad y mantenimiento.'],
        ['¿Puedo probar otra textura?', 'Visualizar ondas, rizos, acabado liso o más volumen.', 'Qué métodos son realistas para el cabello natural.'],
        ['¿La vista es exacta?', 'Crear un concepto rápido para comparar o comentar.', 'Definir expectativas reales tras una consulta y revisión del cabello.'],
      ],
    ],
    scenesTitle: 'Formas de usar el cambiador de peinado con IA',
    scenes: [
      ['Ideas antes de ir al salón', 'Compara varias direcciones antes de hablar con un profesional sobre corte o peinado.'],
      ['Renovar la foto de perfil', 'Prueba nuevos looks para avatares, perfiles de creador, citas o marca personal.'],
      ['Probar cortes masculinos', 'Compara degradados, cortes texturizados, rizos, peinados hacia atrás y rapados.'],
      ['Planificar vestuario y personajes', 'Prueba estilos para cosplay, retratos temáticos, actuaciones y personajes.'],
      ['Crear contenido social', 'Genera variantes para publicaciones, moodboards, miniaturas e ideas previas al cambio.'],
    ],
    featuresTitle: 'Funciones del cambiador de peinado con IA',
    features: [
      ['Flujo con una sola foto', 'Edita un retrato subido en lugar de generar una identidad nueva.'],
      ['Presets visuales', 'Empieza con tarjetas claras sin tener que conocer el nombre exacto de cada estilo.'],
      ['Prompt editable', 'Ajusta largo, capas, flequillo, rizos, volumen, textura y lo que debe conservarse.'],
      ['Estilos para distintos looks', 'Explora opciones largas, cortas, rizadas, lisas, femeninas, masculinas y fáciles de mantener.'],
      ['Genera y perfecciona', 'Cambia el prompt si el largo, la forma, la textura o el realismo no encajan.'],
      ['Uso online gratis', 'Prueba el flujo estándar sin registro y sin marca de agua.'],
    ],
    testimonials: [
      'Opiniones sobre el cambiador de peinado con IA',
      'Toolaze se usa como generador de ideas y referencia visual, no como promesa de un resultado exacto.',
      ['Planificación de un corte corto', 'Comparación de cortes masculinos', 'Conceptos para retratos de creador'],
      [
        'Me costaba imaginarme con un bob. Los presets me ayudaron a comparar el largo y la forma. Algunos mechones no quedaron perfectos, pero la imagen fue una referencia clara para hablar con mi estilista.',
        'Con una foto frontal comparé un degradado taper, un corte texturizado y un rapado. El prompt me permitió pedir menos altura y laterales más limpios antes de comentarlo con mi barbero.',
        'Para renovar mi perfil probé un acabado liso y un bob rizado. Las tarjetas eran rápidas de revisar y los resultados funcionaron bien como moodboard para organizar la sesión.',
      ],
    ],
    faqTitle: 'Preguntas frecuentes sobre el cambiador de peinado con IA',
    faq: [
      ['¿Cómo funciona un cambiador de peinado con IA?', 'Usa tu retrato como referencia y edita el cabello visible según el preset y el prompt. Puedes pedir que conserve rostro, ropa, pose y fondo.'],
      ['¿Qué foto funciona mejor?', 'Elige un retrato frontal o en tres cuartos, con la cabeza completa, luz uniforme y poca obstrucción.'],
      ['¿Puedo probar peinados de mujer y de hombre?', 'Sí. Hay capas largas, ondas, bobs, cortes cortos, degradados, rizos y rapados.'],
      ['¿Puedo personalizar un preset?', 'Sí. Ajusta largo, flequillo, raya, rizos, volumen y textura directamente en el prompt.'],
      ['¿Se mantendrá mi rostro?', 'El prompt solicita conservar la identidad, pero los resultados pueden variar. Revisa la imagen y ajusta el prompt si es necesario.'],
      ['¿Es una simulación exacta del corte?', 'No. Es un concepto visual. El resultado real depende de textura, densidad, crecimiento, largo actual y técnica.'],
      ['¿Toolaze es gratis y sin registro?', 'Sí. El flujo estándar está disponible gratis, sin registro y sin marca de agua.'],
      ['¿Puedo descargar el resultado?', 'Después de generar la imagen, usa los controles disponibles para guardarla o descargarla.'],
      ['¿Puedo mostrarla en el salón?', 'Sí. Úsala como orientación general y confirma con un profesional qué es realista para tu cabello.'],
    ],
    related: ['Herramientas de IA relacionadas', ['Prueba otro color de cabello a partir de un retrato.', 'Edita una imagen subida con un prompt de texto personalizado.', 'Mejora retratos antiguos, descoloridos o dañados online.']],
  },
  fr: {
    meta: [
      'Simulateur de coiffure IA gratuit | Sans inscription | Toolaze',
      'Essayez le simulateur de coiffure IA Toolaze gratuitement, sans inscription ni filigrane. Importez une photo, choisissez un style et ajustez le prompt.',
    ],
    displayName: 'Simulateur de coiffure IA',
    presetTitle: 'Choisir une coiffure',
    styles: ['Carré dégradé', 'Longues couches', 'Cheveux plaqués', 'Ondulations plage', 'Volume sur le côté', 'Dégradé taper', 'Coupe texturée', 'Coupe bouclée', 'Coupe rasée', 'Pixie relevé', 'Carré bouclé'],
    sampleTitle: 'Aperçu de la photo et de l’idée de coiffure',
    hero: [
      'Simulateur de <span class="text-gradient">coiffure IA</span> gratuit',
      'Importez un portrait net, choisissez une coiffure et testez un nouveau look avec un prompt modifiable, sans inscription ni filigrane.',
    ],
    intro: [
      'Qu’est-ce qu’un simulateur de coiffure IA ?',
      'Tester des idées de coupe et de coiffage avec une photo',
      'Un simulateur de coiffure IA modifie les cheveux visibles sur un portrait afin d’explorer une autre coupe, longueur, texture ou finition. Toolaze associe des choix visuels à un prompt modifiable. Le résultat reste un concept visuel et ne garantit pas le rendu d’une vraie coupe.',
    ],
    howTitle: 'Comment changer de coiffure avec l’IA',
    steps: [
      ['Importer un portrait net', 'Utilisez une photo de face ou légèrement de trois quarts où la tête, la forme des cheveux et la ligne frontale sont visibles.'],
      ['Choisir une coiffure', 'Sélectionnez un choix visuel comme un carré, des ondulations, un taper fade, une coupe bouclée ou rasée.'],
      ['Modifier le prompt et générer', 'Ajoutez la longueur, la frange, le volume, les boucles ou les éléments à conserver, puis affinez le résultat.'],
    ],
    ideas: ['Coiffures populaires à essayer', 'Commencez par une référence visuelle, puis ajustez la longueur, la texture, le volume et la finition dans le prompt.', 'Après la sélection, modifiez la longueur, la texture et le volume dans le prompt.'],
    photo: [
      'Conseils photo pour de meilleurs aperçus',
      'Une bonne photo de référence montre clairement le visage, la ligne des cheveux, la forme de la tête, la lumière et l’arrière-plan.',
      [
        ['Montrer toute la tête et les cheveux', 'Évitez les photos coupées au sommet, les chapeaux ou les mains qui cachent une grande partie des cheveux.'],
        ['Utiliser une lumière frontale uniforme', 'Les ombres fortes et le contre-jour compliquent la lecture de la ligne frontale et de la texture.'],
        ['Choisir un angle simple', 'Les portraits de face ou légèrement de trois quarts fonctionnent mieux que les profils extrêmes.'],
        ['Garder le visage dégagé', 'Évitez le flou important, les lunettes sombres et les mèches qui couvrent la majorité du visage.'],
      ],
    ],
    compare: [
      'Aperçu coiffure IA ou vraie coupe',
      'Utilisez le résultat comme direction visuelle. Un professionnel doit encore évaluer la texture, la densité, la pousse, l’entretien et la faisabilité.',
      ['Question', 'L’aperçu IA aide à', 'Un professionnel décide'],
      [
        ['Cette longueur me convient-elle ?', 'Comparer rapidement les proportions courtes, moyennes et longues.', 'La longueur réellement disponible pour obtenir la forme souhaitée.'],
        ['À quoi ressemblerait une frange ?', 'Explorer différentes manières d’encadrer le visage.', 'La coupe adaptée à la ligne frontale, aux épis, à la densité et à l’entretien.'],
        ['Puis-je tester une autre texture ?', 'Visualiser des ondulations, des boucles, un effet lisse ou plus de volume.', 'Les méthodes réalistes pour les cheveux naturels.'],
        ['L’aperçu est-il exact ?', 'Créer un concept rapide à comparer ou à présenter.', 'Les attentes réalistes après consultation et examen des cheveux.'],
      ],
    ],
    scenesTitle: 'Façons d’utiliser le simulateur de coiffure IA',
    scenes: [
      ['Idées avant le salon', 'Comparez plusieurs directions avant de parler coupe ou coiffage avec un professionnel.'],
      ['Actualiser une photo de profil', 'Testez des looks pour avatars, profils de créateur, rencontres ou image personnelle.'],
      ['Essayer des coupes homme', 'Comparez taper fade, coupe texturée, boucles courtes, cheveux plaqués et coupe rasée.'],
      ['Préparer un costume ou un personnage', 'Testez des coiffures pour cosplay, portraits thématiques, spectacles et personnages.'],
      ['Créer du contenu social', 'Produisez des variantes pour publications, moodboards, miniatures et idées avant changement.'],
    ],
    featuresTitle: 'Fonctions du simulateur de coiffure IA',
    features: [
      ['Processus avec une seule photo', 'Modifiez un portrait importé sans générer une nouvelle identité.'],
      ['Références visuelles', 'Commencez avec des cartes claires sans devoir connaître le nom exact de chaque style.'],
      ['Prompt modifiable', 'Ajustez longueur, couches, frange, boucles, volume, texture et éléments à conserver.'],
      ['Styles pour différents looks', 'Explorez des options longues, courtes, bouclées, lisses, féminines, masculines et faciles à entretenir.'],
      ['Générer puis affiner', 'Modifiez le prompt si la longueur, la forme, la texture ou le réalisme doivent évoluer.'],
      ['Utilisation gratuite en ligne', 'Essayez le processus standard sans inscription ni filigrane.'],
    ],
    testimonials: [
      'Avis sur le simulateur de coiffure IA',
      'Toolaze sert à trouver des idées et à créer une référence visuelle, pas à promettre un résultat exact en salon.',
      ['Préparation d’une coupe plus courte', 'Comparaison de coupes homme', 'Concepts pour portraits de créateur'],
      [
        'J’avais du mal à m’imaginer avec un carré. Les choix visuels m’ont aidée à comparer la longueur et la forme. Quelques mèches n’étaient pas parfaites, mais l’image était très utile pour expliquer mon idée au salon.',
        'Avec une photo de face, j’ai comparé un taper fade, une coupe texturée et une coupe rasée. Le prompt m’a permis de demander moins de hauteur et des côtés plus nets avant d’en parler à mon coiffeur.',
        'Pour renouveler ma photo de profil, j’ai testé un effet lisse et un carré bouclé. Les cartes étaient faciles à parcourir et les résultats ont bien servi de moodboard pour préparer la séance.',
      ],
    ],
    faqTitle: 'FAQ du simulateur de coiffure IA',
    faq: [
      ['Comment fonctionne un simulateur de coiffure IA ?', 'Il utilise votre portrait comme référence et modifie les cheveux visibles selon le choix et le prompt. Vous pouvez demander de conserver le visage, les vêtements, la pose et le fond.'],
      ['Quelle photo fonctionne le mieux ?', 'Choisissez un portrait de face ou de trois quarts avec toute la tête visible, une lumière uniforme et peu d’obstruction.'],
      ['Puis-je essayer des coiffures femme et homme ?', 'Oui. Les choix comprennent couches longues, ondulations, carrés, coupes courtes, dégradés, boucles et coupes rasées.'],
      ['Puis-je personnaliser une coiffure ?', 'Oui. Ajustez la longueur, la frange, la raie, les boucles, le volume et la texture directement dans le prompt.'],
      ['Mon visage restera-t-il identique ?', 'Le prompt demande de préserver l’identité, mais les résultats peuvent varier. Vérifiez l’image et affinez le prompt si nécessaire.'],
      ['Est-ce une simulation exacte ?', 'Non. C’est un concept visuel. Le résultat réel dépend de la texture, de la densité, de la pousse, de la longueur actuelle et de la technique.'],
      ['Toolaze est-il gratuit sans inscription ?', 'Oui. Le processus standard est disponible gratuitement, sans inscription ni filigrane.'],
      ['Puis-je télécharger le résultat ?', 'Après la génération, utilisez les commandes disponibles pour enregistrer ou télécharger l’image.'],
      ['Puis-je montrer l’aperçu au salon ?', 'Oui. Utilisez-le comme orientation générale et demandez à un professionnel ce qui est réaliste pour vos cheveux.'],
    ],
    related: ['Outils IA associés', ['Testez une autre couleur de cheveux à partir d’un portrait.', 'Modifiez une image importée avec un prompt personnalisé.', 'Améliorez en ligne des portraits anciens, décolorés ou abîmés.']],
  },
  it: {
    meta: [
      'Cambia acconciatura con IA gratis | Senza registrazione | Toolaze',
      'Prova gratis il cambia acconciatura con IA di Toolaze, senza registrazione e senza filigrana. Carica una foto, scegli uno stile e modifica il prompt.',
    ],
    displayName: 'Cambia acconciatura con IA',
    presetTitle: 'Scegli un’acconciatura',
    styles: ['Bob scalato', 'Scalatura lunga', 'Capelli all’indietro', 'Onde da spiaggia', 'Volume laterale', 'Taper fade', 'Crop texturizzato', 'Crop riccio', 'Buzz cut', 'Pixie raccolto', 'Bob riccio'],
    sampleTitle: 'Anteprima della foto e dell’idea di acconciatura',
    hero: [
      'Cambia <span class="text-gradient">acconciatura con IA</span> gratis',
      'Carica un ritratto nitido, scegli un’acconciatura e prova un nuovo look con un prompt modificabile, senza registrazione e senza filigrana.',
    ],
    intro: [
      'Che cos’è un cambia acconciatura con IA?',
      'Prova idee di taglio e styling con una foto',
      'Un cambia acconciatura con IA modifica i capelli visibili in un ritratto per esplorare un taglio, una lunghezza, una texture o una finitura diversa. Toolaze unisce riferimenti visivi e prompt modificabile. Il risultato è un concetto visivo, non una previsione garantita del taglio reale.',
    ],
    howTitle: 'Come cambiare acconciatura con l’IA',
    steps: [
      ['Carica un ritratto nitido', 'Usa una foto frontale o leggermente di tre quarti con testa, forma dei capelli e attaccatura ben visibili.'],
      ['Scegli un’acconciatura', 'Seleziona un riferimento visivo come bob, onde, taper fade, crop riccio o buzz cut.'],
      ['Modifica il prompt e genera', 'Aggiungi lunghezza, frangia, volume, ricci o elementi da mantenere e perfeziona il risultato.'],
    ],
    ideas: ['Acconciature popolari da provare', 'Inizia da un riferimento visivo e regola nel prompt lunghezza, texture, volume e finitura.', 'Dopo la scelta puoi modificare lunghezza, texture e volume nel prompt.'],
    photo: [
      'Consigli fotografici per anteprime migliori',
      'Una buona foto di riferimento mostra chiaramente viso, attaccatura, forma della testa, luce e sfondo.',
      [
        ['Mostra tutta la testa e i capelli', 'Evita foto tagliate in alto, cappelli o mani che coprono gran parte dei capelli.'],
        ['Usa una luce frontale uniforme', 'Ombre forti e controluce rendono meno leggibili attaccatura e texture.'],
        ['Scegli un’angolazione semplice', 'I ritratti frontali o leggermente di tre quarti funzionano meglio dei profili estremi.'],
        ['Lascia il viso libero', 'Evita forte mosso, occhiali scuri e ciocche che coprono gran parte del volto.'],
      ],
    ],
    compare: [
      'Anteprima con IA e taglio reale',
      'Usa il risultato come direzione visiva. Un professionista deve valutare texture, densità, crescita, manutenzione e fattibilità tecnica.',
      ['Domanda', 'L’anteprima IA aiuta a', 'Un professionista decide'],
      [
        ['Questa lunghezza mi sta bene?', 'Confrontare proporzioni corte, medie e lunghe.', 'Quanta lunghezza può essere rimossa mantenendo la forma desiderata.'],
        ['Come starebbe una frangia?', 'Esplorare modi diversi di incorniciare il viso.', 'Il taglio adatto ad attaccatura, vortici, densità e manutenzione.'],
        ['Posso provare un’altra texture?', 'Visualizzare onde, ricci, effetto liscio o maggiore volume.', 'Quali metodi sono realistici per i capelli naturali.'],
        ['L’anteprima è esatta?', 'Creare un concetto rapido da confrontare o mostrare.', 'Le aspettative realistiche dopo consulenza e analisi dei capelli.'],
      ],
    ],
    scenesTitle: 'Come usare il cambia acconciatura con IA',
    scenes: [
      ['Idee prima del salone', 'Confronta diverse direzioni prima di parlare di taglio o styling con un professionista.'],
      ['Rinnovare la foto profilo', 'Prova look per avatar, profili creator, incontri o personal branding.'],
      ['Provare tagli maschili', 'Confronta taper fade, crop texturizzati, ricci corti, capelli all’indietro e buzz cut.'],
      ['Pianificare costumi e personaggi', 'Prova acconciature per cosplay, ritratti a tema, spettacoli e personaggi.'],
      ['Creare contenuti social', 'Genera varianti per post, moodboard, miniature e idee prima del cambiamento.'],
    ],
    featuresTitle: 'Funzioni del cambia acconciatura con IA',
    features: [
      ['Flusso con una sola foto', 'Modifica un ritratto caricato senza creare una nuova identità.'],
      ['Riferimenti visivi', 'Parti da schede chiare senza conoscere il nome esatto di ogni stile.'],
      ['Prompt modificabile', 'Regola lunghezza, scalatura, frangia, ricci, volume, texture e parti da conservare.'],
      ['Stili per look diversi', 'Esplora opzioni lunghe, corte, ricce, lisce, femminili, maschili e facili da gestire.'],
      ['Genera e perfeziona', 'Cambia il prompt se lunghezza, forma, texture o realismo non sono ancora corretti.'],
      ['Uso online gratuito', 'Prova il flusso standard senza registrazione e senza filigrana.'],
    ],
    testimonials: [
      'Cosa dicono gli utenti',
      'Toolaze viene usato per trovare idee e creare riferimenti visivi, non per promettere un risultato identico dal parrucchiere.',
      ['Pianificazione di un taglio corto', 'Confronto di tagli maschili', 'Idee per ritratti creator'],
      [
        'Non riuscivo a immaginarmi con un bob. I riferimenti visivi mi hanno aiutata a confrontare lunghezza e forma. Alcune ciocche non erano perfette, ma l’immagine è stata utile per spiegare l’idea al salone.',
        'Con una foto frontale ho confrontato taper fade, crop texturizzato e buzz cut. Nel prompt ho chiesto meno altezza e lati più puliti prima di parlarne con il mio barbiere.',
        'Per aggiornare il profilo ho provato un look liscio e un bob riccio. Le schede erano rapide da scorrere e i risultati hanno funzionato bene come moodboard per organizzare lo shooting.',
      ],
    ],
    faqTitle: 'Domande frequenti sul cambia acconciatura con IA',
    faq: [
      ['Come funziona un cambia acconciatura con IA?', 'Usa il ritratto come riferimento e modifica i capelli visibili in base alla scelta e al prompt. Puoi chiedere di mantenere viso, abiti, posa e sfondo.'],
      ['Quale foto funziona meglio?', 'Scegli un ritratto frontale o di tre quarti con tutta la testa visibile, luce uniforme e poche parti coperte.'],
      ['Posso provare acconciature femminili e maschili?', 'Sì. Sono disponibili scalature lunghe, onde, bob, tagli corti, sfumature, ricci e buzz cut.'],
      ['Posso personalizzare uno stile?', 'Sì. Modifica lunghezza, frangia, riga, ricci, volume e texture direttamente nel prompt.'],
      ['Il mio viso resterà uguale?', 'Il prompt chiede di conservare l’identità, ma i risultati possono variare. Controlla l’immagine e perfeziona il prompt.'],
      ['È una simulazione esatta del taglio?', 'No. È un concetto visivo. Il risultato reale dipende da texture, densità, crescita, lunghezza attuale e tecnica.'],
      ['Toolaze è gratis e senza registrazione?', 'Sì. Il flusso standard è disponibile gratis, senza registrazione e senza filigrana.'],
      ['Posso scaricare il risultato?', 'Dopo la generazione usa i controlli disponibili per salvare o scaricare l’immagine.'],
      ['Posso mostrare l’anteprima al salone?', 'Sì. Usala come direzione generale e verifica con un professionista cosa è realistico per i tuoi capelli.'],
    ],
    related: ['Strumenti IA correlati', ['Prova un colore di capelli diverso partendo da un ritratto.', 'Modifica un’immagine caricata con un prompt personalizzato.', 'Migliora online ritratti vecchi, sbiaditi o danneggiati.']],
  },
  ja: {
    meta: [
      '無料AI髪型チェンジャー | 登録不要 | Toolaze',
      'ToolazeのAI髪型チェンジャーを無料で利用できます。写真を1枚アップロードし、髪型を選び、プロンプトを調整して新しい印象を試せます。',
    ],
    displayName: 'AI髪型チェンジャー',
    presetTitle: '髪型を選ぶ',
    styles: ['レイヤーボブ', 'ロングレイヤー', 'オールバック', 'ビーチウェーブ', 'サイドボリューム', 'テーパーフェード', 'テクスチャークロップ', 'カーリークロップ', 'バズカット', 'ピクシーアップ', 'カーリーボブ'],
    sampleTitle: '写真と髪型イメージのプレビュー',
    hero: [
      '無料のAI <span class="text-gradient">髪型チェンジャー</span>',
      '鮮明な顔写真を1枚アップロードし、髪型を選んで、編集可能なプロンプトで新しいスタイルを試せます。登録不要で透かしもありません。',
    ],
    intro: [
      'AI髪型チェンジャーとは？',
      '1枚の写真でカットとスタイリングの案を試す',
      'AI髪型チェンジャーは、顔写真に写っている髪を編集し、カット、長さ、質感、仕上がりの違いを視覚化するツールです。Toolazeは画像付きの髪型プリセットと編集可能なプロンプトを組み合わせています。結果はイメージ案であり、実際の施術結果を保証するものではありません。',
    ],
    howTitle: 'AIで髪型を変える方法',
    steps: [
      ['鮮明な顔写真をアップロード', '頭全体、髪の形、生え際が見える正面または軽い斜め向きの写真を使います。'],
      ['髪型を選択', 'ボブ、ウェーブ、テーパーフェード、カーリークロップ、バズカットなどから選びます。'],
      ['プロンプトを編集して生成', '長さ、前髪、ボリューム、カール、維持したい部分を追加し、必要に応じて再調整します。'],
    ],
    ideas: ['試してみたい人気の髪型', '画像付きプリセットから始め、長さ、質感、ボリューム、仕上がりをプロンプトで調整します。', '選択後も、長さ、質感、ボリュームをプロンプトで調整できます。'],
    photo: [
      'より良い髪型プレビューの写真ポイント',
      '顔、生え際、頭の形、光、背景がはっきりした写真ほど編集しやすくなります。',
      [
        ['頭と髪全体を写す', '頭頂部が切れている写真、帽子、手で髪が大きく隠れている写真は避けます。'],
        ['正面から均一に照らす', '強い影や逆光は、生え際や髪の質感を判断しにくくします。'],
        ['シンプルな角度を選ぶ', '極端な横顔より、正面または軽い斜め向きの写真が適しています。'],
        ['顔を隠さない', '強い手ぶれ、濃いサングラス、顔の大部分を覆う髪は避けます。'],
      ],
    ],
    compare: [
      'AI髪型プレビューと実際のカットの違い',
      'AI結果は方向性を比べるために使います。髪質、毛量、生え方、手入れ、施術の現実性は美容師や理容師が判断します。',
      ['確認したいこと', 'AIプレビューでできること', '専門家が判断すること'],
      [
        ['この長さが似合うか', '短め、中間、長めの見た目を比較する。', '希望の形を保ちながら実際に切れる長さを判断する。'],
        ['前髪がどう見えるか', '顔まわりの印象や方向性を試す。', '生え際、つむじ、毛量、手入れに合わせて切り方を決める。'],
        ['別の質感を試せるか', 'ウェーブ、カール、ストレート、ボリュームを視覚化する。', '自然な髪に合う現実的なスタイリング方法を判断する。'],
        ['プレビューは正確か', '比較や相談用のイメージをすばやく作る。', '相談と髪の状態をもとに現実的な期待値を設定する。'],
      ],
    ],
    scenesTitle: 'AI髪型チェンジャーの活用例',
    scenes: [
      ['サロン前の髪型検討', 'カットやスタイリングを相談する前に、複数の方向性を比較できます。'],
      ['プロフィール写真の更新', 'アバター、クリエイタープロフィール、マッチング、個人ブランド用の案を試せます。'],
      ['メンズカットの比較', 'テーパーフェード、クロップ、短いカール、オールバック、バズカットを比較できます。'],
      ['衣装やキャラクターの準備', 'コスプレ、テーマ写真、舞台、キャラクター案の髪型を試せます。'],
      ['SNS向けクリエイティブ', '投稿、ムードボード、サムネイル、変更前のアイデア用にバリエーションを作れます。'],
    ],
    featuresTitle: 'AI髪型チェンジャーの機能',
    features: [
      ['写真1枚のワークフロー', '新しい人物を作らず、アップロードした顔写真を直接編集します。'],
      ['画像付き髪型プリセット', '髪型名を詳しく知らなくても、見た目から選択できます。'],
      ['編集可能なプロンプト', '長さ、レイヤー、前髪、カール、ボリューム、質感、維持する部分を調整できます。'],
      ['幅広いスタイル', 'ロング、ショート、カール、ストレート、女性向け、男性向け、手入れしやすい案を試せます。'],
      ['生成後に再調整', '長さ、形、質感、自然さが合わない場合はプロンプトを変更できます。'],
      ['無料オンライン利用', '標準機能は登録不要、透かしなしで試せます。'],
    ],
    testimonials: [
      'AI髪型チェンジャーの利用者の声',
      'Toolazeは正確な施術結果を保証するものではなく、アイデア作成と相談用の視覚資料として使われています。',
      ['短めのカットを検討', 'メンズカットを比較', 'クリエイター写真の企画'],
      [
        'ボブが自分に合うか想像しにくかったので、長さと形を比較しました。細かな髪の表現は完璧ではありませんでしたが、美容師に希望を伝える参考として役立ちました。',
        '正面写真でテーパーフェード、テクスチャークロップ、バズカットを比較しました。プロンプトで高さを抑え、サイドをすっきりさせる指定もできました。',
        'プロフィール写真の更新用に、すっきりしたスタイルとカーリーボブを試しました。カードが見やすく、撮影準備のムードボードとして使いやすかったです。',
      ],
    ],
    faqTitle: 'AI髪型チェンジャーのよくある質問',
    faq: [
      ['AI髪型チェンジャーはどのように動きますか？', 'アップロードした顔写真を参照し、選択した髪型とプロンプトに合わせて髪を編集します。顔、服、ポーズ、背景を維持する指定もできます。'],
      ['どのような写真が適していますか？', '頭全体が見え、光が均一で、顔や髪の隠れが少ない正面または斜め向きの写真がおすすめです。'],
      ['女性向けと男性向けの髪型を試せますか？', 'はい。ロングレイヤー、ウェーブ、ボブ、短いクロップ、フェード、カール、バズカットなどがあります。'],
      ['プリセットを調整できますか？', 'はい。長さ、前髪、分け目、カール、ボリューム、質感をプロンプトで変更できます。'],
      ['顔は同じままですか？', 'プロンプトは本人らしさの維持を指定しますが、結果には差が出る場合があります。必要に応じて再調整してください。'],
      ['実際のカットを正確に再現しますか？', 'いいえ。視覚的な案です。実際の結果は髪質、毛量、生え方、現在の長さ、施術方法で変わります。'],
      ['Toolazeは無料で登録不要ですか？', 'はい。標準機能は無料、登録不要、透かしなしで利用できます。'],
      ['結果をダウンロードできますか？', '生成後、ページ上の保存またはダウンロード操作を利用できます。'],
      ['サロンで参考画像として使えますか？', 'はい。一般的な方向性として提示し、実現可能かを専門家に確認してください。'],
    ],
    related: ['関連するAIツール', ['1枚の顔写真から別の髪色を試せます。', 'アップロード画像をカスタムプロンプトで編集できます。', '古い、色あせた、傷んだ顔写真をオンラインで改善できます。']],
  },
  ko: {
    meta: [
      '무료 AI 헤어스타일 체인저 | 가입 없이 | Toolaze',
      'Toolaze AI 헤어스타일 체인저를 무료로 사용하세요. 사진 한 장을 올리고 스타일을 선택한 뒤 프롬프트를 조정할 수 있습니다.',
    ],
    displayName: 'AI 헤어스타일 체인저',
    presetTitle: '헤어스타일 선택',
    styles: ['레이어드 보브', '롱 레이어', '슬릭백', '비치 웨이브', '사이드 볼륨', '테이퍼 페이드', '텍스처 크롭', '컬리 크롭', '버즈컷', '픽시 업스타일', '컬리 보브'],
    sampleTitle: '사진과 헤어스타일 아이디어 미리보기',
    hero: [
      '무료 AI <span class="text-gradient">헤어스타일 체인저</span>',
      '선명한 인물 사진 한 장을 업로드하고 스타일을 선택해 편집 가능한 프롬프트로 새로운 모습을 확인하세요. 가입과 워터마크가 없습니다.',
    ],
    intro: [
      'AI 헤어스타일 체인저란?',
      '사진 한 장으로 커트와 스타일 아이디어 확인',
      'AI 헤어스타일 체인저는 인물 사진의 보이는 머리카락을 편집해 다른 커트, 길이, 질감, 스타일을 비교하는 도구입니다. Toolaze는 이미지 프리셋과 편집 가능한 프롬프트를 함께 제공합니다. 결과는 시각적 아이디어이며 실제 시술 결과를 보장하지 않습니다.',
    ],
    howTitle: 'AI로 헤어스타일을 바꾸는 방법',
    steps: [
      ['선명한 인물 사진 업로드', '머리 전체, 헤어 형태, 헤어라인이 보이는 정면 또는 가벼운 측면 사진을 사용하세요.'],
      ['헤어스타일 선택', '보브, 웨이브, 테이퍼 페이드, 컬리 크롭, 버즈컷 같은 이미지 프리셋을 선택하세요.'],
      ['프롬프트 편집 후 생성', '길이, 앞머리, 볼륨, 컬, 유지할 요소를 추가하고 결과를 다시 조정하세요.'],
    ],
    ideas: ['인기 헤어스타일 아이디어', '이미지 프리셋으로 시작한 뒤 길이, 질감, 볼륨, 마무리를 프롬프트에서 조정하세요.', '선택 후에도 길이, 질감, 볼륨을 프롬프트에서 수정할 수 있습니다.'],
    photo: [
      '더 나은 헤어스타일 미리보기를 위한 사진 팁',
      '얼굴, 헤어라인, 머리 형태, 조명, 배경이 선명한 사진일수록 편집에 유리합니다.',
      [
        ['머리와 모발 전체 표시', '머리 윗부분이 잘리거나 모자와 손으로 머리카락이 많이 가려진 사진은 피하세요.'],
        ['고른 정면 조명 사용', '강한 그림자와 역광은 헤어라인과 질감을 파악하기 어렵게 합니다.'],
        ['단순한 각도 선택', '극단적인 옆모습보다 정면이나 가벼운 삼분할 각도가 좋습니다.'],
        ['얼굴을 가리지 않기', '심한 흔들림, 짙은 선글라스, 얼굴 대부분을 가리는 머리카락은 피하세요.'],
      ],
    ],
    compare: [
      'AI 헤어스타일 미리보기와 실제 커트',
      'AI 결과는 방향을 비교하는 참고 자료입니다. 모발 질감, 밀도, 성장 방향, 관리, 시술 가능성은 전문가가 판단해야 합니다.',
      ['질문', 'AI 미리보기의 도움', '전문가의 판단'],
      [
        ['이 길이가 어울릴까?', '짧은 길이, 중간 길이, 긴 길이의 비율을 비교합니다.', '원하는 형태를 유지하면서 실제로 자를 수 있는 길이를 판단합니다.'],
        ['앞머리는 어떻게 보일까?', '얼굴을 감싸는 여러 방향을 확인합니다.', '헤어라인, 가마, 밀도, 관리 습관에 맞는 커트를 결정합니다.'],
        ['다른 질감을 시도할 수 있을까?', '웨이브, 컬, 매끈한 스타일, 볼륨을 시각화합니다.', '자연 모발에 현실적인 스타일링 방법을 판단합니다.'],
        ['미리보기가 정확할까?', '비교하거나 상담할 빠른 콘셉트를 만듭니다.', '상담과 모발 상태를 바탕으로 현실적인 기대를 설정합니다.'],
      ],
    ],
    scenesTitle: 'AI 헤어스타일 체인저 활용 방법',
    scenes: [
      ['살롱 방문 전 아이디어', '전문가와 커트나 스타일을 상담하기 전에 여러 방향을 비교하세요.'],
      ['프로필 사진 새로 만들기', '아바타, 크리에이터 프로필, 데이팅, 퍼스널 브랜딩용 모습을 시험하세요.'],
      ['남성 커트 비교', '테이퍼 페이드, 텍스처 크롭, 짧은 컬, 슬릭백, 버즈컷을 비교하세요.'],
      ['의상과 캐릭터 기획', '코스프레, 테마 사진, 공연, 캐릭터 콘셉트에 맞는 스타일을 시험하세요.'],
      ['소셜 콘텐츠 제작', '게시물, 무드보드, 썸네일, 변화 전 아이디어용 변형을 만드세요.'],
    ],
    featuresTitle: 'AI 헤어스타일 체인저 기능',
    features: [
      ['사진 한 장 워크플로', '새 인물을 만들지 않고 업로드한 인물 사진을 직접 편집합니다.'],
      ['이미지 헤어스타일 프리셋', '정확한 스타일 이름을 몰라도 이미지 카드로 시작할 수 있습니다.'],
      ['편집 가능한 프롬프트', '길이, 레이어, 앞머리, 컬, 볼륨, 질감, 유지할 요소를 조정합니다.'],
      ['다양한 스타일', '긴 머리, 짧은 머리, 컬, 매끈한 스타일, 여성과 남성 스타일을 시험합니다.'],
      ['생성 후 다시 조정', '길이, 형태, 질감, 자연스러움이 맞지 않으면 프롬프트를 수정합니다.'],
      ['무료 온라인 이용', '표준 기능을 가입 없이 워터마크 없이 시험할 수 있습니다.'],
    ],
    testimonials: [
      'AI 헤어스타일 체인저 사용자 후기',
      'Toolaze는 정확한 시술 결과를 약속하는 도구가 아니라 아이디어와 상담용 시각 자료로 활용됩니다.',
      ['짧은 커트 계획', '남성 커트 비교', '크리에이터 인물 사진 기획'],
      [
        '보브가 어울릴지 상상하기 어려워 길이와 형태를 비교했습니다. 일부 머리카락 표현은 완벽하지 않았지만 미용사에게 원하는 방향을 설명하는 데 도움이 됐습니다.',
        '정면 사진으로 테이퍼 페이드, 텍스처 크롭, 버즈컷을 비교했습니다. 프롬프트에서 높이를 줄이고 옆부분을 더 깔끔하게 요청할 수 있었습니다.',
        '프로필 사진을 바꾸기 전에 매끈한 스타일과 컬리 보브를 시험했습니다. 카드가 보기 쉬웠고 결과를 촬영 준비용 무드보드로 활용했습니다.',
      ],
    ],
    faqTitle: 'AI 헤어스타일 체인저 자주 묻는 질문',
    faq: [
      ['AI 헤어스타일 체인저는 어떻게 작동하나요?', '업로드한 인물 사진을 참고해 선택한 스타일과 프롬프트에 따라 보이는 머리카락을 편집합니다. 얼굴, 옷, 자세, 배경 유지도 요청할 수 있습니다.'],
      ['어떤 사진이 가장 좋나요?', '머리 전체가 보이고 조명이 고르며 얼굴과 머리카락을 가리는 요소가 적은 정면 또는 삼분할 사진이 좋습니다.'],
      ['여성과 남성 헤어스타일을 모두 시험할 수 있나요?', '네. 롱 레이어, 웨이브, 보브, 짧은 크롭, 페이드, 컬, 버즈컷을 포함합니다.'],
      ['프리셋을 수정할 수 있나요?', '네. 길이, 앞머리, 가르마, 컬, 볼륨, 질감을 프롬프트에서 직접 수정할 수 있습니다.'],
      ['얼굴이 그대로 유지되나요?', '프롬프트는 정체성 유지를 요청하지만 결과는 달라질 수 있습니다. 이미지를 확인하고 필요하면 다시 조정하세요.'],
      ['실제 커트를 정확히 시뮬레이션하나요?', '아니요. 시각적 콘셉트입니다. 실제 결과는 모발 질감, 밀도, 성장, 현재 길이, 시술 방식에 따라 달라집니다.'],
      ['Toolaze는 무료이고 가입이 필요 없나요?', '네. 표준 기능은 무료이며 가입과 워터마크가 없습니다.'],
      ['결과를 다운로드할 수 있나요?', '생성 후 페이지의 저장 또는 다운로드 기능을 사용할 수 있습니다.'],
      ['살롱에서 참고 이미지로 사용할 수 있나요?', '네. 일반적인 방향을 전달하는 자료로 사용하고 전문가에게 현실적인 가능성을 확인하세요.'],
    ],
    related: ['관련 AI 도구', ['인물 사진 한 장으로 다른 머리 색을 시험합니다.', '업로드한 이미지를 사용자 프롬프트로 편집합니다.', '오래되고 색이 바래거나 손상된 인물 사진을 온라인에서 개선합니다.']],
  },
  pt: {
    meta: [
      'Trocador de penteado com IA grátis | Sem cadastro | Toolaze',
      'Use o trocador de penteado com IA da Toolaze grátis, sem cadastro e sem marca d’água. Envie uma foto, escolha um estilo e ajuste o prompt.',
    ],
    displayName: 'Trocador de penteado com IA',
    presetTitle: 'Escolha um penteado',
    styles: ['Bob em camadas', 'Camadas longas', 'Penteado para trás', 'Ondas de praia', 'Volume lateral', 'Taper fade', 'Corte texturizado', 'Corte cacheado', 'Buzz cut', 'Pixie preso', 'Bob cacheado'],
    sampleTitle: 'Prévia da foto e da ideia de penteado',
    hero: [
      'Trocador de <span class="text-gradient">penteado com IA</span> grátis',
      'Envie um retrato nítido, escolha um penteado e experimente um novo visual com prompt editável, sem cadastro e sem marca d’água.',
    ],
    intro: [
      'O que é um trocador de penteado com IA?',
      'Teste ideias de corte e estilo com uma foto',
      'Um trocador de penteado com IA edita o cabelo visível em um retrato para explorar outro corte, comprimento, textura ou acabamento. A Toolaze combina opções visuais com um prompt editável. O resultado é um conceito visual e não uma garantia do corte real.',
    ],
    howTitle: 'Como mudar o penteado com IA',
    steps: [
      ['Envie um retrato nítido', 'Use uma foto frontal ou levemente de três quartos com toda a cabeça, o formato do cabelo e a linha frontal visíveis.'],
      ['Escolha um penteado', 'Selecione uma opção visual como bob, ondas, taper fade, corte cacheado ou buzz cut.'],
      ['Edite o prompt e gere', 'Adicione comprimento, franja, volume, cachos ou elementos que devem permanecer e refine o resultado.'],
    ],
    ideas: ['Penteados populares para experimentar', 'Comece com uma opção visual e ajuste comprimento, textura, volume e acabamento no prompt.', 'Depois da escolha, ajuste comprimento, textura e volume no prompt.'],
    photo: [
      'Dicas de foto para melhores prévias',
      'Uma boa referência mostra claramente o rosto, a linha do cabelo, o formato da cabeça, a luz e o fundo.',
      [
        ['Mostre toda a cabeça e o cabelo', 'Evite fotos cortadas no topo, chapéus ou mãos cobrindo grande parte do cabelo.'],
        ['Use luz frontal uniforme', 'Sombras fortes e contraluz dificultam a leitura da linha do cabelo e da textura.'],
        ['Escolha um ângulo simples', 'Retratos frontais ou levemente de três quartos funcionam melhor que perfis extremos.'],
        ['Mantenha o rosto livre', 'Evite desfoque forte, óculos escuros e mechas cobrindo a maior parte do rosto.'],
      ],
    ],
    compare: [
      'Prévia com IA e corte real',
      'Use o resultado como direção visual. Um profissional ainda deve avaliar textura, densidade, crescimento, manutenção e viabilidade técnica.',
      ['Pergunta', 'A prévia com IA ajuda a', 'Um profissional decide'],
      [
        ['Esse comprimento combina comigo?', 'Comparar proporções curtas, médias e longas.', 'Quanto comprimento pode ser removido mantendo o formato desejado.'],
        ['Como ficaria uma franja?', 'Explorar formas de emoldurar o rosto.', 'O corte adequado à linha frontal, redemoinhos, densidade e manutenção.'],
        ['Posso testar outra textura?', 'Visualizar ondas, cachos, efeito liso ou mais volume.', 'Quais métodos são realistas para o cabelo natural.'],
        ['A prévia é exata?', 'Criar um conceito rápido para comparar ou apresentar.', 'As expectativas reais após consulta e análise do cabelo.'],
      ],
    ],
    scenesTitle: 'Formas de usar o trocador de penteado com IA',
    scenes: [
      ['Ideias antes do salão', 'Compare várias direções antes de conversar sobre corte ou estilo com um profissional.'],
      ['Renovar a foto de perfil', 'Teste looks para avatares, perfis de criador, encontros ou marca pessoal.'],
      ['Experimentar cortes masculinos', 'Compare taper fade, cortes texturizados, cachos curtos, penteado para trás e buzz cut.'],
      ['Planejar figurinos e personagens', 'Teste estilos para cosplay, retratos temáticos, apresentações e personagens.'],
      ['Criar conteúdo social', 'Gere variações para posts, moodboards, miniaturas e ideias antes da mudança.'],
    ],
    featuresTitle: 'Recursos do trocador de penteado com IA',
    features: [
      ['Fluxo com uma foto', 'Edite um retrato enviado sem criar uma nova identidade.'],
      ['Opções visuais de penteado', 'Comece por cartões claros sem precisar saber o nome exato de cada estilo.'],
      ['Prompt editável', 'Ajuste comprimento, camadas, franja, cachos, volume, textura e partes que devem permanecer.'],
      ['Estilos para vários looks', 'Explore opções longas, curtas, cacheadas, lisas, femininas, masculinas e fáceis de cuidar.'],
      ['Gere e refine', 'Mude o prompt se comprimento, formato, textura ou realismo ainda não estiverem certos.'],
      ['Uso online grátis', 'Experimente o fluxo padrão sem cadastro e sem marca d’água.'],
    ],
    testimonials: [
      'O que os usuários dizem',
      'A Toolaze é usada para gerar ideias e referências visuais, não para prometer um resultado idêntico no salão.',
      ['Planejamento de um corte curto', 'Comparação de cortes masculinos', 'Conceitos para retratos de criador'],
      [
        'Eu não conseguia me imaginar com um bob. As opções visuais ajudaram a comparar comprimento e formato. Alguns fios não ficaram perfeitos, mas a imagem foi útil para explicar a ideia no salão.',
        'Com uma foto frontal comparei taper fade, corte texturizado e buzz cut. No prompt pedi menos altura e laterais mais limpas antes de conversar com meu barbeiro.',
        'Para atualizar meu perfil, testei um visual liso e um bob cacheado. Os cartões eram fáceis de analisar e os resultados funcionaram como moodboard para planejar o ensaio.',
      ],
    ],
    faqTitle: 'Perguntas frequentes sobre o trocador de penteado com IA',
    faq: [
      ['Como funciona um trocador de penteado com IA?', 'Ele usa seu retrato como referência e edita o cabelo visível conforme a opção e o prompt. Você pode pedir para manter rosto, roupa, pose e fundo.'],
      ['Qual foto funciona melhor?', 'Escolha um retrato frontal ou de três quartos com a cabeça inteira visível, luz uniforme e pouca obstrução.'],
      ['Posso testar penteados femininos e masculinos?', 'Sim. Há camadas longas, ondas, bobs, cortes curtos, fades, cachos e buzz cuts.'],
      ['Posso personalizar uma opção?', 'Sim. Ajuste comprimento, franja, divisão, cachos, volume e textura diretamente no prompt.'],
      ['Meu rosto será mantido?', 'O prompt pede preservação da identidade, mas os resultados podem variar. Revise a imagem e ajuste o prompt.'],
      ['É uma simulação exata do corte?', 'Não. É um conceito visual. O resultado real depende de textura, densidade, crescimento, comprimento atual e técnica.'],
      ['A Toolaze é grátis e sem cadastro?', 'Sim. O fluxo padrão está disponível grátis, sem cadastro e sem marca d’água.'],
      ['Posso baixar o resultado?', 'Depois de gerar, use os controles disponíveis para salvar ou baixar a imagem.'],
      ['Posso mostrar a prévia no salão?', 'Sim. Use como direção geral e confirme com um profissional o que é realista para o seu cabelo.'],
    ],
    related: ['Ferramentas de IA relacionadas', ['Teste uma cor de cabelo diferente usando um retrato.', 'Edite uma imagem enviada com um prompt personalizado.', 'Melhore retratos antigos, desbotados ou danificados online.']],
  },
  'zh-TW': {
    meta: [
      '免費 AI 髮型變換器 | 免註冊 | Toolaze',
      '免費使用 Toolaze AI 髮型變換器，免註冊、無浮水印。上傳一張照片、選擇髮型並調整 Prompt，即可預覽新造型。',
    ],
    displayName: 'AI 髮型變換器',
    presetTitle: '選擇髮型',
    styles: ['層次鮑伯', '長層次', '後梳髮型', '海灘波浪捲', '側分蓬鬆', '漸層短髮', '紋理短髮', '捲髮短剪', '平頭', '精靈盤髮', '捲髮鮑伯'],
    sampleTitle: '照片與髮型靈感預覽',
    hero: [
      '免費 AI <span class="text-gradient">髮型變換器</span>',
      '上傳一張清晰人像、選擇髮型，並用可編輯的 Prompt 預覽新造型。免註冊、無浮水印。',
    ],
    intro: [
      '什麼是 AI 髮型變換器？',
      '用一張照片測試剪髮與造型靈感',
      'AI 髮型變換器會編輯人像中可見的頭髮，讓你比較不同剪裁、長度、質感與造型方向。Toolaze 結合圖片式髮型選項與可編輯 Prompt。結果是視覺概念，不保證與實際剪髮完全相同。',
    ],
    howTitle: '如何用 AI 更換髮型',
    steps: [
      ['上傳清晰人像', '使用正面或輕微側面照片，確保完整頭部、髮型輪廓與髮際線清楚可見。'],
      ['選擇髮型', '從鮑伯、波浪捲、漸層短髮、捲髮短剪或平頭等圖片選項中挑選。'],
      ['編輯 Prompt 並生成', '加入長度、瀏海、蓬鬆度、捲度或需要保留的細節，再生成並調整結果。'],
    ],
    ideas: ['熱門髮型靈感', '先選擇圖片式髮型，再於 Prompt 中調整長度、質感、蓬鬆度與完成效果。', '選擇後仍可在 Prompt 中調整長度、質感與蓬鬆度。'],
    photo: [
      '提升髮型預覽效果的照片技巧',
      '清楚呈現臉部、髮際線、頭型、光線與背景的照片，更有利於產生穩定結果。',
      [
        ['完整顯示頭部與頭髮', '避免頭頂被裁切、戴帽子，或雙手遮住大面積頭髮的照片。'],
        ['使用均勻正面光線', '強烈陰影與逆光會讓髮際線和髮絲質感更難判讀。'],
        ['選擇簡單角度', '正面或輕微三分之二角度，通常比極端側臉更適合。'],
        ['保持臉部清楚', '避免嚴重模糊、深色太陽眼鏡或頭髮遮住大部分臉部。'],
      ],
    ],
    compare: [
      'AI 髮型預覽與實際剪髮的差異',
      'AI 結果適合比較視覺方向。髮質、髮量、生長方向、整理需求與實際可行性，仍需由專業設計師評估。',
      ['問題', 'AI 預覽可協助', '專業設計師判斷'],
      [
        ['這個長度適合我嗎？', '快速比較短、中、長髮的視覺比例。', '在保留理想輪廓下，實際可剪除的長度。'],
        ['瀏海看起來如何？', '嘗試不同臉部修飾與造型方向。', '依髮際線、髮旋、髮量與整理習慣決定剪法。'],
        ['可以測試不同質感嗎？', '預覽波浪、捲髮、直順或增加蓬鬆度。', '哪些整理方式適合你的自然髮質。'],
        ['預覽結果精準嗎？', '快速建立可比較或討論的視覺概念。', '依諮詢與頭髮狀況設定實際期待。'],
      ],
    ],
    scenesTitle: 'AI 髮型變換器的使用情境',
    scenes: [
      ['沙龍前的髮型規劃', '與專業設計師討論前，先比較多種剪裁與造型方向。'],
      ['更新個人檔案照片', '測試適合頭像、創作者頁面、交友或個人品牌的新造型。'],
      ['比較男性剪髮', '嘗試漸層、紋理短髮、短捲髮、後梳與平頭。'],
      ['規劃服裝與角色', '為 Cosplay、主題人像、表演與角色概念測試髮型。'],
      ['製作社群內容', '為貼文、情緒板、縮圖與改造前靈感建立不同版本。'],
    ],
    featuresTitle: 'AI 髮型變換器功能',
    features: [
      ['單張照片流程', '直接編輯上傳的人像，不重新產生另一個人物。'],
      ['圖片式髮型選項', '不必熟悉每個髮型名稱，也能從清楚的圖片卡片開始。'],
      ['可編輯 Prompt', '調整長度、層次、瀏海、捲度、蓬鬆度、質感與需保留的部分。'],
      ['多種造型方向', '探索長髮、短髮、捲髮、直順、女性、男性與低維護造型。'],
      ['生成後繼續調整', '若長度、輪廓、質感或自然度不理想，可修改 Prompt。'],
      ['免費線上使用', '標準流程可免註冊、無浮水印使用。'],
    ],
    testimonials: [
      '使用者如何評價 AI 髮型變換器',
      'Toolaze 適合產生靈感與溝通用視覺參考，不代表沙龍一定能做出完全相同的結果。',
      ['規劃較短髮型', '比較男性剪髮', '創作者人像概念'],
      [
        '我一直很難想像自己剪鮑伯的樣子。圖片選項讓我能比較長度與輪廓。部分髮絲並不完美，但作為和設計師溝通的參考非常實用。',
        '我用正面照片比較漸層短髮、紋理短髮與平頭，還能在 Prompt 中要求降低頂部高度並讓兩側更俐落，再和理髮師討論。',
        '更新個人檔案前，我測試了直順造型與捲髮鮑伯。卡片很容易瀏覽，結果也適合作為拍攝前的情緒板。',
      ],
    ],
    faqTitle: 'AI 髮型變換器常見問題',
    faq: [
      ['AI 髮型變換器如何運作？', '工具會以上傳的人像為參考，依選擇的髮型與 Prompt 編輯可見頭髮。你也可以要求保留臉部、服裝、姿勢與背景。'],
      ['哪種照片效果最好？', '建議使用完整頭部可見、光線均勻、遮擋較少的正面或輕微側面人像。'],
      ['可以測試女性與男性髮型嗎？', '可以。選項包含長層次、波浪捲、鮑伯、短髮、漸層、捲髮與平頭。'],
      ['可以自訂髮型選項嗎？', '可以。選擇後可在 Prompt 中修改長度、瀏海、分線、捲度、蓬鬆度與質感。'],
      ['臉部會保持不變嗎？', 'Prompt 會要求保留人物特徵，但生成結果仍可能不同。請檢查圖片並視需要重新調整。'],
      ['這是精準的剪髮模擬嗎？', '不是。這是視覺概念。實際結果取決於髮質、髮量、生長方向、目前長度與施作技術。'],
      ['Toolaze 免費且免註冊嗎？', '是。標準流程可免費使用，免註冊且無浮水印。'],
      ['可以下載結果嗎？', '生成後可使用頁面提供的儲存或下載功能。'],
      ['可以拿給髮型設計師參考嗎？', '可以。請將它作為大方向，並與專業設計師確認哪些效果適合你的頭髮。'],
    ],
    related: ['相關 AI 工具', ['用一張人像測試不同髮色。', '以自訂文字 Prompt 編輯上傳的圖片。', '在線改善老舊、褪色或受損的人像照片。']],
  },
}

const ideaStyleIndexes = [0, 3, 10, 9, 6, 8]

for (const [locale, spec] of Object.entries(specs)) {
  const data = structuredClone(source)

  data.metadata.title = spec.meta[0]
  data.metadata.description = spec.meta[1]
  data.topTool.displayName = spec.displayName
  data.topTool.functionalAcceptance.presetTitle = spec.presetTitle
  data.topTool.functionalAcceptance.presets.forEach((preset, index) => {
    preset.label = spec.styles[index]
  })
  data.topTool.sampleImages[0].title = spec.sampleTitle
  data.hero.h1 = spec.hero[0]
  data.hero.desc = spec.hero[1]
  data.intro.title = spec.intro[0]
  data.intro.content[0].title = spec.intro[1]
  data.intro.content[0].text = spec.intro[2]
  data.howToUse.title = spec.howTitle
  data.howToUse.steps.forEach((step, index) => {
    step.title = spec.steps[index][0]
    step.desc = spec.steps[index][1]
  })
  data.promptExamples.title = spec.ideas[0]
  data.promptExamples.subtitle = spec.ideas[1]
  data.promptExamples.items.forEach((item, index) => {
    item.title = spec.styles[ideaStyleIndexes[index]]
    item.note = spec.ideas[2]
  })
  data.photoTips.title = spec.photo[0]
  data.photoTips.subtitle = spec.photo[1]
  data.photoTips.items.forEach((item, index) => {
    item.title = spec.photo[2][index][0]
    item.desc = spec.photo[2][index][1]
  })
  data.workflowComparison.title = spec.compare[0]
  data.workflowComparison.subtitle = spec.compare[1]
  data.workflowComparison.columns = spec.compare[2]
  data.workflowComparison.rows = spec.compare[3]
  data.scenesTitle = spec.scenesTitle
  data.scenes.forEach((scene, index) => {
    scene.title = spec.scenes[index][0]
    scene.desc = spec.scenes[index][1]
  })
  data.features.title = spec.featuresTitle
  data.features.items.forEach((item, index) => {
    item.title = spec.features[index][0]
    item.desc = spec.features[index][1]
  })
  data.testimonials.title = spec.testimonials[0]
  data.testimonials.subtitle = spec.testimonials[1]
  data.testimonials.items.forEach((item, index) => {
    item.role = spec.testimonials[2][index]
    item.quote = spec.testimonials[3][index]
  })
  data.faqTitle = spec.faqTitle
  data.faq = spec.faq.map(([q, a]) => ({ q, a }))
  data.moreTools = spec.related[0]
  data.moreToolsLinks.forEach((item, index) => {
    item.description = spec.related[1][index]
  })

  const output = path.join(root, 'src/data', locale, 'ai-hairstyle-changer.json')
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

console.log(`Generated ${Object.keys(specs).length} localized AI Hairstyle Changer files.`)
