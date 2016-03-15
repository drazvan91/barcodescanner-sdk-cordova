//  SBSTypeConversion.m
//  HelloCordova
//
//  Created by Marco Biasini on 15/03/16.
//
//

#import "SBSTypeConversion.h"
#import <ScanditBarcodeScanner/ScanditBarcodeScanner.h>


NSArray *SBSJSObjectsFromCodeArray(NSArray *codes) {
    NSMutableArray *finalArray = [[NSMutableArray alloc] init];
    for (SBSCode *code in codes) {
        NSMutableDictionary *dict =
            [NSMutableDictionary dictionaryWithObjectsAndKeys:
                                     [code symbologyName], @"symbology",
                                     [NSNumber numberWithBool:[code isGs1DataCarrier]], @"gs1DataCarrier",
                                     [NSNumber numberWithBool:[code isRecognized]], @"recognized", nil];
        if ([code isRecognized]) {
            [dict setObject:[code data] forKey:@"data"];
        }
        [finalArray addObject:dict];
    }
    return finalArray;
}

NSString* SBSScanStateToString(SBSScanCaseState state) {
    switch (state) {
        case SBSScanCaseStateActive:
            return @"active";
        case SBSScanCaseStateOff:
            return @"off";
        case SBSScanCaseStateStandby:
            return @"standby";
    }
    return @"unknown";
}

SBSScanCaseState SBSScanStateFromString(NSString *state) {
    if ([state isEqualToString:@"active"])
        return SBSScanCaseStateActive;
    if ([state isEqualToString:@"standby"])
        return SBSScanCaseStateStandby;
    if ([state isEqualToString:@"off"])
        return SBSScanCaseStateOff;
    
    // FIXME: raise NSException?
    return SBSScanCaseStateOff;
}

NSString * SBSScanStateChangeReasonToString(SBSScanCaseStateChangeReason reason) {
    switch (reason) {
        case SBSScanCaseStateChangeReasonManual:
            return @"manual";
        case SBSScanCaseStateChangeReasonTimeout:
            return @"timeout";
        case SBSScanCaseStateChangeReasonVolumeButton:
            return @"volumeButton";
    }
    return @"unknown";
}
