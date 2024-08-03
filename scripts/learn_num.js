setTimeout(() => {
    document.querySelector('.loader-container').style.display = 'none';
}, 3000);

const micButton = document.getElementById('mic-button');
const micIcon = document.getElementById('mic-icon');
const resetButton = document.getElementById('reset-conversation');
const audioPlayback = document.getElementById('audio-playback');
const apiResponseDiv = document.getElementById('api-response');
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let conversationId = "";
let conversationHistory = [];

micButton.addEventListener('click', async () => {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                processAudioAndGetResponse(audioBlob);
            };

            mediaRecorder.start();
            isRecording = true;
            micIcon.style.fill = 'red';
        } catch (error) {
            console.error('Error accessing microphone:', error);
            resetMicButton();
        }
    } else {
        mediaRecorder.stop();
        isRecording = false;
        micIcon.style.fill = 'orange';
        micButton.disabled = true;
    }
});

resetButton.addEventListener('click', () => {
    conversationId = "";
    conversationHistory = [];
    console.log("Conversation reset.");
});

async function processAudioAndGetResponse(audioBlob) {
    try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');
        formData.append('user', 'unique-user-id');  // Replace with your user identifier

        const speechToTextResponse = await fetchWithTimeout('https://api.dify.ai/v1/audio-to-text', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer app-tPcGKFQtiAEDxcSd6WWf72Pm',  // Replace with your API key
            },
            body: formData,
        }, 30000);

        if (speechToTextResponse.ok) {
            const result = await speechToTextResponse.json();
            await sendToChatAPI(result.text);
        } else {
            const errorText = await speechToTextResponse.text();
            throw new Error(`Speech-to-Text API Error: ${speechToTextResponse.status} - ${speechToTextResponse.statusText} - ${errorText}`);
        }
    } catch (error) {
        console.error('Error during processing:', error);
    } finally {
        resetMicButton();
    }
}

async function sendToChatAPI(query) {
    const data = {
        inputs: {},
        query: query,
        response_mode: "blocking",
        conversation_id: conversationId,
        user: "unique-user-id"  // Replace with your user identifier
    };

    const chatResponse = await fetchWithTimeout('https://api.dify.ai/v1/chat-messages', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer app-tPcGKFQtiAEDxcSd6WWf72Pm`,  // Replace with your API key
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }, 30000);

    if (chatResponse.ok) {
        const responseData = await chatResponse.json();
        if (responseData.answer) {
            // Store the conversation ID if it's not set yet
            if (!conversationId) {
                conversationId = responseData.conversation_id;
            }
            await convertTextToAudio(responseData.answer, responseData.id);
        } else {
            throw new Error('No answer in the chat API response');
        }
    } else {
        throw new Error(`Chat API Error: ${chatResponse.status} - ${chatResponse.statusText}`);
    }
}

async function convertTextToAudio(text, messageId) {
    const data = {
        text: text,
        user: 'unique-user-id',  // Replace with your user identifier
        message_id: messageId
    };

    const textToAudioResponse = await fetchWithTimeout('https://api.dify.ai/v1/text-to-audio', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer app-tPcGKFQtiAEDxcSd6WWf72Pm',  // Replace with your API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }, 30000);

    if (textToAudioResponse.ok) {
        const audioBlob = await textToAudioResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioUrl;
        audioPlayback.play();

        // Check if the response contains "woof" (case-insensitive)
        if (text.toLowerCase().includes("woof")) {
            const dogSound = document.getElementById('dog-sound');
            dogSound.play();
        }

        // Display the response text
        apiResponseDiv.textContent = text;
        apiResponseDiv.style.display = 'block';
    } else {
        const errorText = await textToAudioResponse.text();
        throw new Error(`Text-to-Audio API Error: ${textToAudioResponse.status} - ${textToAudioResponse.statusText} - ${errorText}`);
    }
}

async function fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
}

function resetMicButton() {
    micIcon.style.fill = 'white';
    micButton.disabled = false;
}

function openSidebar() {
    document.getElementById("mySidebar").style.width = "250px";
}

function closeSidebar() {
    document.getElementById("mySidebar").style.width = "0";
}