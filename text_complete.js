/* Copyright (c) 2019 Fabrice Bellard */
"use strict";
var output_text_active = false;
var cancel_request = false;
var raw_output_text = "";
var output_text = "";
var input_text = "";
var model_params = "";
var socket_url = "wss://bellard.org/textsynth/ws";
var socket;

var button_el = document.getElementById("submit_button");
var more_button_el = document.getElementById("more_button");

function html_escape(s)
{
    var i, r, c;
    r = "";
    for(i = 0; i < s.length; i++) {
        c = s[i];
        switch(c) {
        case "<":
            r += "&lt;";
            break;
        case ">":
            r += "&gt;";
            break;
        case "&":
            r += "&amp;";
            break;
        case "\"":
            r += "&quot;";
            break;
        default:
            r += c;
            break;
        }
    }
    return r;
}

/* only trim the "space" character */
function trim_spaces(str)
{
    var l, i, j;
    l = str.length;
    i = 0;
    while (i < l && str[i] == ' ')
        i++;
    j = l;
    while (j > i && str[j - 1] == ' ')
        j--;
    return str.slice(i, j);
}

var example_inputs = [
    "In a shocking finding, scientist discovered a herd of unicorns living in a remote, previously unexplored valley, in the Andes Mountains. Even more surprising to the researchers was the fact that the unicorns spoke perfect English.",
    "My name is John. I am 34 year old.\n\nQ: What is my name ?\nA:",
    "int main(int argc, char **argv) {",
    "Making an omelette is simple!\n\n1.",
    "The Linux kernel is",
    "Game of Thrones is",
    "<html>",
    "The election to the European Parliament",
    "The United States Air Force facility commonly known as Area 51 is a highly classified remote detachment"
];
  
function on_select()
{
    var select_el = document.getElementById("select");
    var input_text_el = document.getElementById("input_text");
    var val = select_el.value | 0;
    if (val) {
        input_text_el.value = example_inputs[val - 1];
    }
}

function output_text_update()
{
    var gtext_el = document.getElementById("gtext");
    gtext_el.innerHTML = output_text;
}

function complete_init()
{
    var el;
    el = document.getElementById("input_text");
    el.value = "";

    el = document.getElementById("select");
    el.value = "0";

    el = document.getElementById("model");
    el.value = "345M";

    el = document.getElementById("topk");
    el.value = "40";

    el = document.getElementById("topp");
    el.value = "0.9";

    el = document.getElementById("temperature");
    el.value = "1.0";

    el = document.getElementById("seed");
    el.value = "0";
}

function button_submit()
{
    var input_text_el = document.getElementById("input_text");

    if (output_text_active) {
        cancel_request = true;
    } else {
        complete_start(input_text_el.value, false);
    }
}

function button_more()
{
    complete_start(raw_output_text, true);
}

function set_param_error(e)
{
    var el;
    el = document.getElementById("param_error");
    el.innerHTML = e;
}

function compute_model_params()
{
    var s, el, v, d;

    set_param_error("");
    
    el = document.getElementById("model");
    s = el.value;

    el = document.getElementById("topk");
    v = el.value | 0;
    if (v < 1 || v > 1000) {
        set_param_error("top-k must be between 1 and 1000");
        return "";
    }
    s += "," + v;

    el = document.getElementById("topp");
    v = +el.value;
    if (v <= 0 || v > 1) {
        set_param_error("top-p must be between 0 and 1");
        return "";
    }
    s += "," + v;

    el = document.getElementById("temperature");
    v = +el.value;
    if (v <= 0.1 || v > 10) {
        set_param_error("temperature must be between 0.1 and 10");
        return "";
    }
    s += "," + v;

    el = document.getElementById("seed");
    v = el.value | 0;
    if (v == 0) {
        d = Date.now();
        v = (d | 0) + ((d / 4294967296) | 0);
    }
    s += "," + v;
    return s;
}

function complete_start(str, more_output)
{
    var gtext_header_el = document.getElementById("gtext_header");

    input_text = trim_spaces(str);
    if (input_text != "") {
        model_params = compute_model_params();
        if (model_params == "")
            return false;
        try {
            socket = new WebSocket(socket_url);
        } catch(err) {
            socket = null;
            console.log("Could not open websocket err=" + err);
            return false;
        }
        socket.onmessage = socket_on_message;
        socket.onclose = socket_on_close;
        socket.onopen = socket_on_open;
        socket.onerror = socket_on_error;
        
        gtext_header_el.style.display = "block";
        more_button_el.style.display = "none";
        
        button_el.innerHTML = "Stop";
        
        if (!more_output) {
            raw_output_text = input_text;
            output_text = "<b>" + html_escape(input_text) + "</b>";
        }
        output_text_update();
        output_text_active = true;
        cancel_request = false;
    }
}


function socket_on_open(e)
{
    socket.send("g," + model_params + "," + input_text);
}

function socket_on_message(e)
{
    if (cancel_request) {
        socket.close();
    } else {
        raw_output_text += e.data;
        output_text += html_escape(e.data);
        output_text_update();
    }
}

function socket_on_close()
{
    complete_end();
}

function socket_on_error(e)
{
    console.log("websocket error=" + e);
}

function complete_end()
{
    button_el.innerHTML = "Generate another";
    more_button_el.style.display = "inline";
    output_text_active = false;
}
