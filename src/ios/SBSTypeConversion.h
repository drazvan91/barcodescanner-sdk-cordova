//
//  SBSTypeConversion.h
//  HelloCordova
//
//  Created by Marco Biasini on 15/03/16.
//
//

#import <Foundation/Foundation.h>
#import <ScanditBarcodeScanner/ScanditBarcodeScanner.h>

#ifdef __cplusplus
extern "C" {
#endif
    
NSArray *SBSJSObjectsFromCodeArray(NSArray *codes);
NSString* SBSScanStateToString(SBSScanCaseState state);
SBSScanCaseState SBSScanStateFromString(NSString *state);
NSString * SBSScanStateChangeReasonToString(SBSScanCaseStateChangeReason reason);

#ifdef __cplusplus
}
#endif
