package com.hamiltonn.foodstore

import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.widget.Button
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import java.util.Locale

class Aboutus : AppCompatActivity() {
    lateinit var tts:TextToSpeech
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_aboutus)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        val textView=findViewById<TextView>(R.id.textview)
        val btnlisten=findViewById<Button>(R.id.listen)
        tts=TextToSpeech(this){
            if(it==TextToSpeech.SUCCESS){
                tts.language= Locale.US
            }
            btnlisten.setOnClickListener {
                val mytext=textView.text.toString()
                tts.speak(mytext,TextToSpeech.QUEUE_FLUSH,null)
            }
        }

    }

    override fun onDestroy() {
        tts.stop()
        tts.shutdown()

        super.onDestroy()
    }
}